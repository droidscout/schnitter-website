FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy local code with correct ownership (using built-in 'node' user)
COPY --chown=node:node . /app

# Switch to non-root user 'node' (uid 1000)
USER node

# Install dependencies and build
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_RECAPTCHA_SITE_KEY=${VITE_RECAPTCHA_SITE_KEY}
ENV INLINE_RUNTIME_CHUNK=false
RUN npm install --no-audit --no-fund
RUN npm run build -dev

FROM nginx:alpine AS runner

# NGINX configuration for SPA routing
COPY infra/nginx.conf /etc/nginx/conf.d/default.conf

# Copy .env file

# Static assets built by Vite
COPY --from=builder /app/dist /usr/share/nginx/html/
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
CMD ["nginx", "-g", "daemon off;"]
