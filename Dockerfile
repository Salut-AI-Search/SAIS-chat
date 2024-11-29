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