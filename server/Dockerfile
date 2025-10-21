FROM node:20-alpine

ENV NODE_ENV=production

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# Copy application source
COPY . .

EXPOSE 3000

CMD ["node", "index.js"]

