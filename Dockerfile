# Stage 1: Build Quasar App
FROM node:22 AS builder

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source files and build the app
COPY . .
RUN yarn build

# Stage 2: Serve with Caddy
FROM caddy:2.7.4-alpine

# Copy the built app to Caddy's default root
COPY --from=builder /app/dist/spa /srv

# Configure Caddy
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80 443
