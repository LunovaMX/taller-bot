# Stage 1: Build
FROM node:21-alpine3.18 as builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Enable corepack and install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH

# Copy package files, rollup config, TypeScript source files, and assets
COPY package*.json *-lock.yaml ./
COPY rollup.config.js ./
COPY tsconfig.json ./
COPY src ./src
COPY assets ./assets

# Install dependencies and build the project
RUN apk add --no-cache --virtual .gyp \
    python3 \
    make \
    g++ \
    && apk add --no-cache git \
    && pnpm install \
    && pnpm run build

# Ensure ecosystem.config.cjs is copied if used by PM2
COPY ecosystem.config.cjs ./

# Stage 2: Deployment
FROM node:21-alpine3.18 as deploy

WORKDIR /app

ARG PORT
ENV PORT $PORT
EXPOSE $PORT

# Install pnpm globally
RUN npm install -g pnpm

# Enable corepack and install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH

# Copy necessary files from builder stage
COPY --from=builder /app/assets ./assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json /app/*-lock.yaml ./
COPY --from=builder /app/rollup.config.js ./
COPY --from=builder /app/ecosystem.config.cjs ./

# Install only production dependencies
RUN pnpm install --production --ignore-scripts \
    && addgroup -g 1001 -S nodejs && adduser -S -u 1001 nodejs \
    && chown -R nodejs:nodejs /app

# Install PM2 globally
RUN pnpm add pm2 -g

# Set user to nodejs
USER nodejs

# Start the application using PM2
CMD ["pm2-runtime", "start", "ecosystem.config.cjs"]
