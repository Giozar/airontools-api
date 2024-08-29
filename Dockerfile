# Base image with Node.js
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# Install dependencies only when needed
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build the app with cached dependencies
FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable
RUN pnpm build

# Production image, copy all necessary files and run the app
FROM base AS runner

# Set working directory
WORKDIR /usr/src/app

# Optional: Create a non-root user and group for better security
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nestuser
# RUN addgroup -S nodegroup && adduser -S nestuser -G nodegroup

# Copy package.json and pnpm-lock.yaml for production dependencies
COPY package.json pnpm-lock.yaml ./

# Install production dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist

# Optional: Assign correct permissions to the non-root user
# RUN chown -R nestuser:nodegroup /usr/src/app

# Expose the application port (ensure this matches your environment variable)
EXPOSE ${SERVER_PORT:-4000}  
# Usar SERVER_PORT si está definido, sino usar 4000 por defecto

# Define environment variables
ENV NODE_ENV=production
ENV SERVER_PORT=${SERVER_PORT}
ENV DATABASE_HOST=${DATABASE_HOST}
ENV DATABASE_NAME=${DATABASE_NAME}
ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}
ENV DATABASE_PORT=${DATABASE_PORT}
ENV HOST_API=${HOST_API}
ENV CLIENT_PORT=${CLIENT_PORT}
ENV JWT_SECRET=${JWT_SECRET}
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
ENV AWS_REGION=${AWS_REGION}
ENV AWS_BUCKET_NAME=${AWS_BUCKET_NAME}
ENV AI_API=${AI_API}
ENV OPENAI_API_KEY=${OPENAI_API_KEY}

# Optional: Switch to non-root user for better security
# USER nestuser

# Command to run the application
CMD [ "node", "dist/main" ]
