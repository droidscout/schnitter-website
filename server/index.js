import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3000;

// Config
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || 'http://localhost:8080';
const CONTACT_RECEIVER_EMAIL = process.env.CONTACT_RECEIVER_EMAIL || 'ralph.loser@posteo.de';
const TOKEN_TTL_MINUTES = parseInt(process.env.TOKEN_TTL_MINUTES || '60', 10);

// CORS: allow frontend origin
app.use(cors({ origin: new URL(FRONTEND_BASE_URL).origin, credentials: false }));
app.use(express.json());

// In-memory token store
const tokens = new Map();

function makeTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;
  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: String(SMTP_SECURE || 'false') === 'true',
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  // Fallback: stream to console
  return nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true,
  });
}

const transporter = makeTransporter();

app.post('/contact', async (req, res) => {
  const { name, email, phone, message } = req.body || {};
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

app.get('/confirm', async (req, res) => {
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
  const target = `${FRONTEND_BASE_URL.replace(/\/+$/, '')}/danke`;
  res.redirect(302, target);
});

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Contact API listening on :${PORT}`));

