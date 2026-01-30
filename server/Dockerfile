FROM node:20-alpine

ENV NODE_ENV=production

WORKDIR /app
RUN chown node:node /app

USER node

# Install only production dependencies
COPY --chown=node:node package*.json ./
# Use npm ci when a lockfile exists, otherwise fall back to npm install
RUN if [ -f package-lock.json ]; then \
  npm ci --omit=dev --no-audit --no-fund; \
  else \
  npm install --omit=dev --no-audit --no-fund; \
  fi

# Copy application source
COPY --chown=node:node . .

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "index.js"]
