# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN cd server && npx prisma generate

# Build client (static files)
RUN npm run build --workspace=client

# Build server
RUN npm run build --workspace=server

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

RUN npm ci --only=production --workspace=server

# Copy Prisma schema and generated client
COPY server/prisma ./server/prisma
RUN cd server && npx prisma generate

# Copy built files
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/client/dist ./client/dist

# Create data directory for SQLite database
RUN mkdir -p /app/data

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_URL=file:/app/data/prod.db

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Run database migrations and start server
CMD cd server && npx prisma migrate deploy && node dist/index.js
