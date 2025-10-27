import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3000;

// Config
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || 'http://localhost:8079';
const THANK_YOU_PAGE_URL = process.env.THANK_YOU_PAGE_URL || '/danke';
const CONTACT_RECEIVER_EMAIL = process.env.CONTACT_RECEIVER_EMAIL || 'ralph.loser@posteo.de';
const TOKEN_TTL_MINUTES = parseInt(process.env.TOKEN_TTL_MINUTES || '60', 10);

// CORS: allow frontend origin + handle preflight
const corsOptions = { origin: new URL(FRONTEND_BASE_URL).origin, credentials: false };
app.use(cors(corsOptions));
app.options('/api/*', cors(corsOptions));
app.use(express.json());

// In-memory token store
const tokens = new Map();

// In-memory rate limiter (IP-based)
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 10);
const rateStore = new Map(); // ip -> { count, resetAt }

function normalizeIp(ip) {
  if (!ip) return '';
  // strip IPv6 mapped prefix ::ffff:
  return ip.replace(/^::ffff:/, '');
}

function clientSourceIp(req) {
  // Use the socket remote address to enforce container-level IP restrictions
  return normalizeIp(req.socket?.remoteAddress || req.ip || '');
}

function isAllowedSource(req) {
  if(process.env.NODE_ENV === 'development') return true; // allow all in dev
  const allowed = normalizeIp(process.env.ALLOWED_SOURCE_IP || '');
  const src = clientSourceIp(req);
  if (!allowed) return true; // no restriction configured
  if (src === allowed) return true;
  // allow localhost in non-production for local dev/testing
  if (process.env.NODE_ENV !== 'production' && (src === '127.0.0.1' || src === '::1')) return true;
  return false;
}

function trueClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length) {
    const first = xff.split(',')[0].trim();
    return normalizeIp(first);
  }
  return normalizeIp(req.ip || '');
}

function applyRateLimit(req, res) {
  const ip = trueClientIp(req) || 'unknown';
  const now = Date.now();
  const entry = rateStore.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  entry.count += 1;
  rateStore.set(ip, entry);
  if (entry.count > RATE_LIMIT_MAX) {
    res.setHeader('Retry-After', Math.ceil((entry.resetAt - now) / 1000));
    res.status(429).json({ ok: false, error: 'Zu viele Anfragen. Bitte später erneut versuchen.' });
    return false;
  }
  return true;
}

async function verifyRecaptcha(token, remoteIp) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return { ok: true }; // allow if not configured
  if (!token) return { ok: false, error: 'reCAPTCHA erforderlich.' };
  try {
    const params = new URLSearchParams({ secret, response: token });
    if (remoteIp) params.set('remoteip', remoteIp);
    const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });
    const data = await resp.json();
    if (!data.success) {
      console.warn('reCAPTCHA verification failed:', {
        success: data.success,
        hostname: data.hostname,
        'error-codes': data['error-codes'],
        challenge_ts: data.challenge_ts,
        action: data.action,
        score: data.score,
      });
      return { ok: false, error: 'reCAPTCHA-Überprüfung fehlgeschlagen.' };
    }
    // For v3 we could check score/action if desired
    return { ok: true };
  } catch (err) {
    console.error('reCAPTCHA verify error:', err);
    return { ok: false, error: 'reCAPTCHA-Überprüfung nicht möglich.' };
  }
}

function makeTransporter() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    SMTP_REQUIRE_TLS,
    SMTP_TLS_MIN_VERSION,
    SMTP_TLS_REJECT_INVALID,
    NODE_ENV,
  } = process.env;

  const haveCreds = !!(SMTP_HOST && SMTP_USER && SMTP_PASS);

  if (haveCreds) {
    const secure = String(SMTP_SECURE || 'false') === 'true'; // SMTPS (implicit TLS)
    const requireTLS = String(SMTP_REQUIRE_TLS || (!secure ? 'true' : 'false')) === 'true'; // STARTTLS enforcement when not using implicit TLS
    const port = Number(SMTP_PORT || (secure ? 465 : 587));

    // Enforce TLS-only in production
    if (NODE_ENV === 'production' && !secure && !requireTLS) {
      throw new Error('SMTP security required: set SMTP_SECURE=true (465) or SMTP_REQUIRE_TLS=true (587).');
    }

    const enableDebug = String(process.env.SMTP_DEBUG || 'false') === 'true';
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure, // true = SMTPS (implicit TLS)
      requireTLS, // true = STARTTLS is required when secure=false
      tls: {
        minVersion: SMTP_TLS_MIN_VERSION || 'TLSv1.2',
        rejectUnauthorized: String(SMTP_TLS_REJECT_INVALID || 'true') === 'true',
      },
      // Enforce AUTH LOGIN unless overridden
      authMethod: (process.env.SMTP_AUTH_METHOD || 'LOGIN').toUpperCase(),
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      logger: enableDebug,
      debug: enableDebug,
    });
  }

  // Fallback for local dev without SMTP credentials
  if (NODE_ENV === 'production') {
    throw new Error('SMTP not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and security variables.');
  }

  return nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true,
  });
}

const transporter = makeTransporter();

app.post('/api/contact', async (req, res) => {
  // Enforce source IP restriction
  if (!isAllowedSource(req)) {
    return res.status(403).json({ ok: false, error: 'Zugriff verweigert.' });
  }
  if (!applyRateLimit(req, res)) return; // may send 429
  const { name, email, phone, message } = req.body || {};
  // Verify reCAPTCHA
  const recaptchaToken = req.body?.recaptchaToken;
  const v = await verifyRecaptcha(recaptchaToken, trueClientIp(req));
  if (!v.ok) return res.status(400).json({ ok: false, error: v.error });
  if (!email || !name) {
    return res.status(400).json({ ok: false, error: 'Name und E-Mail sind erforderlich.' });
  }

  const token = uuidv4();
  const now = Date.now();
  tokens.set(token, { name, email, phone, message, createdAt: now });

  const confirmUrl = `${FRONTEND_BASE_URL.replace(/\/+$/, '')}/api/confirm?token=${token}`.replace('/api/confirm','/api/confirm');
  // Note: confirm is served by this API; but user will hit it via NGINX proxy at same host

  const mail = {
    from: CONTACT_RECEIVER_EMAIL,
    to: email,
    subject: 'Bitte bestätigen Sie Ihre Anfrage (Double-Opt-In)',
    text: `Hallo ${name},\n\nbitte bestätigen Sie Ihre Anfrage, indem Sie auf folgenden Link klicken:\n${FRONTEND_BASE_URL.replace(/\/+$/, '')}/api/confirm?token=${token}\n\nVielen Dank!`,
    html: `<p>Hallo ${name},</p><p>bitte bestätigen Sie Ihre Anfrage, indem Sie auf folgenden Link klicken:</p><p><a href="${FRONTEND_BASE_URL.replace(/\/+$/, '')}/api/confirm?token=${token}">Anfrage bestätigen</a></p><p>Vielen Dank!</p>`
  };

  try {
    const info = await transporter.sendMail(mail);
    if (info.message) {
      console.log('Email preview (no SMTP configured):\n', info.message.toString());
    }
  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ ok: false, error: 'E-Mail Versand fehlgeschlagen.' });
  }

  return res.json({ ok: true, message: 'Bitte bestätigen Sie Ihre E-Mail. Wir haben Ihnen einen Link geschickt.' });
});

app.get('/api/confirm', async (req, res) => {
  const { token } = req.query;
  const record = tokens.get(token);
  if (!record) return res.status(400).send('Ungültiger oder abgelaufener Token.');
  if (Date.now() - record.createdAt > TOKEN_TTL_MINUTES * 60 * 1000) {
    tokens.delete(token);
    return res.status(400).send('Token abgelaufen.');
  }

  // Forward the enquiry to receiver
  try {
    await transporter.sendMail({
      from: record.email,
      to: CONTACT_RECEIVER_EMAIL,
      subject: `Neue Kontaktanfrage von ${record.name}`,
      text: `Name: ${record.name}\nE-Mail: ${record.email}\nTelefon: ${record.phone || '-'}\n\nNachricht:\n${record.message || ''}`,
    });
  } catch (err) {
    console.error('Forward email error:', err);
  }

  tokens.delete(token);
  // Redirect to thank-you page on frontend
  const target = `${FRONTEND_BASE_URL.replace(/\/+$/, '')}${THANK_YOU_PAGE_URL}`;
  res.redirect(302, target);
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Contact API listening on :${PORT}`));
