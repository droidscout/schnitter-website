FROM node:20-alpine AS builder

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Install git to fetch sources
RUN apk add --no-cache git

# Build args: provide your repository URL and optional ref (branch/tag/commit)
ARG REPO_URL="https://github.com/droidscout/schnitter-website.git"
ARG REPO_REF=staging
ARG VITE_API_BASE_URL
ARG VITE_RECAPTCHA_SITE_KEY

WORKDIR /app
RUN chown -R nodejs:nodejs /app
USER nodejs
RUN rm -rf dist
# Fail clearly if no repo URL provided
RUN test -n "$REPO_URL" || (echo "ERROR: REPO_URL build-arg not provided" && exit 1)

# Shallow clone for speed; checkout ref if specified
RUN git clone "$REPO_URL" -b "$REPO_REF" /app

# Install dependencies and build
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_RECAPTCHA_SITE_KEY=${VITE_RECAPTCHA_SITE_KEY}
ENV INLINE_RUNTIME_CHUNK=false
RUN npm install --no-audit --no-fund; 
RUN npm run build -dev

FROM nginx:alpine AS runner

# NGINX configuration for SPA routing
COPY infra/nginx.conf /etc/nginx/conf.d/default.conf

# Copy .env file
COPY .env /usr/share/nginx/html/.env
# Static assets built by Vite
COPY --from=builder /app/dist /usr/share/nginx/html/
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
CMD ["nginx", "-g", "daemon off;"]
