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

# Build the app with cache dependencies
FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable
RUN pnpm build



# Production image, copy all the files and run next
FROM base AS runner

# Set working directory
WORKDIR /usr/src/app

# Create non-root group and user
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nestuser
#RUN addgroup -S nodegroup && adduser -S nestuser -G nodegroup

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist

# Assign correct permissions to the non-root user
#RUN chown -R nestuser:nodegroup /usr/src/app

# Switch to non-root user
#USER nestuser

EXPOSE 4000

CMD [ "node","dist/main" ]