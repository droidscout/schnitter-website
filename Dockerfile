FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy local code (as root)
COPY . /app

# Install dependencies and build
ARG VITE_API_BASE_URL
ARG VITE_RECAPTCHA_SITE_KEY
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_RECAPTCHA_SITE_KEY=${VITE_RECAPTCHA_SITE_KEY}
ENV INLINE_RUNTIME_CHUNK=false
# Use --unsafe-perm to allow root to own the installed modules (optional but safe here)
RUN npm install --no-audit --no-fund
RUN npm run build -dev

FROM nginx:alpine AS runner

# NGINX configuration for SPA routing (using templates for env var substitution)
COPY infra/nginx.conf /etc/nginx/templates/default.conf.template

# Copy .env file

# Static assets built by Vite
COPY --from=builder /app/dist /usr/share/nginx/html/
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/health || exit 1
CMD ["nginx", "-g", "daemon off;"]
