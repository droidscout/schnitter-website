FROM node:20-alpine

ENV NODE_ENV=production

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
# Use npm ci when a lockfile exists, otherwise fall back to npm install
RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev --no-audit --no-fund; \
    else \
      npm install --omit=dev --no-audit --no-fund; \
    fi

# Copy application source
COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
