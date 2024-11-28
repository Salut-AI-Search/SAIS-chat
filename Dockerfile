# Stage 1: Build Quasar App
FROM node:22 AS builder

WORKDIR /app

# Install dependencies
COPY app/package.json app/package-lock.json ./
RUN npm ci

# Copy source files and build the app
COPY app ./
ENV CI=false
RUN npm run build || true

# Stage 2: Serve with Caddy
FROM caddy:2.7.4-alpine

# Copy the built app to Caddy's default root
COPY --from=builder /app/dist/spa /srv

# Configure Caddy
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80 443
