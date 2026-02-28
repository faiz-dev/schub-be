# ============================
# Stage 1: Builder
# ============================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source code
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY libs/ ./libs/
COPY apps/ ./apps/

# Build all services
RUN npx nest build identity-service && \
    npx nest build academic-service && \
    npx nest build gateway-service

# ============================
# Stage 2: Production Runner
# ============================
FROM node:20-alpine AS runner

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps && npm cache clean --force

# Copy built output from builder
COPY --from=builder /app/dist ./dist

# Service to run is determined by the SERVICE_NAME build arg
ARG SERVICE_NAME
ENV SERVICE_NAME=${SERVICE_NAME}

EXPOSE 3000 3001 3002

# Run the specified service
CMD node dist/apps/${SERVICE_NAME}/main
