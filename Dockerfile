# Stage 1: Build
FROM node:21-alpine3.18 as builder

WORKDIR /app

# Enable corepack and install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin

# Install dependencies and build the project
COPY package*.json *-lock.yaml ./
RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++ \
    && apk add --no-cache git \
    && pnpm install \
    && pnpm run build \
    && apk del .gyp

# Stage 2: Deployment
FROM node:21-alpine3.18 as deploy

WORKDIR /app

ARG PORT
ENV PORT $PORT
EXPOSE $PORT

# Copy necessary files from builder stage
COPY --from=builder /app/assets ./assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json /app/*-lock.yaml ./

# Re-enable corepack and install only production dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate 
ENV PNPM_HOME=/usr/local/bin

# Clean cache and install only production dependencies
RUN pnpm cache clean --force \
    && pnpm install --production --ignore-scripts \
    && addgroup -g 1001 -S nodejs && adduser -S -u 1001 nodejs \
    && rm -rf $PNPM_HOME/.npm $PNPM_HOME/.node-gyp

# Install PM2 globally
RUN pnpm add pm2 -g

# Start the application using PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--cron", "0 */12 * * *"]
