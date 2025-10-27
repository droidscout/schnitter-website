FROM node:20-alpine AS builder

# Install git to fetch sources
RUN apk add --no-cache git

# Build args: provide your repository URL and optional ref (branch/tag/commit)
ARG REPO_URL="https://github.com/droidscout/schnitter-website.git"
# ARG REPO_REF=master
ARG VITE_API_BASE_URL
ARG VITE_RECAPTCHA_SITE_KEY

WORKDIR /app

# Fail clearly if no repo URL provided
RUN test -n "$REPO_URL" || (echo "ERROR: REPO_URL build-arg not provided" && exit 1)

# Shallow clone for speed; checkout ref if specified
RUN git clone "$REPO_URL" /app \
  && if [ -n "$REPO_REF" ]; then \
       git fetch --depth 1 origin "$REPO_REF" || true; \
       git checkout "$REPO_REF" || true; \
     fi

# Install dependencies and build
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_RECAPTCHA_SITE_KEY=${VITE_RECAPTCHA_SITE_KEY}
ENV INLINE_RUNTIME_CHUNK=false
RUN npm install --no-audit --no-fund; 
RUN npm run build

FROM nginx:alpine AS runner

# NGINX configuration for SPA routing
COPY infra/nginx.conf /etc/nginx/conf.d/default.conf

# Copy .env file
COPY .env /usr/share/nginx/html/schnitter/.env
# Static assets built by Vite
COPY --from=builder /app/dist /usr/share/nginx/html/schnitter

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
