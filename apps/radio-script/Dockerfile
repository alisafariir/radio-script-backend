# -----------------------------------------------------------
# Stage 1: Build
# -----------------------------------------------------------
FROM node:latest AS builder

WORKDIR /app

COPY package*.json ./

# Install dependencies - robust approach that handles all cases
RUN if [ -f package-lock.json ]; then \
    npm ci || (echo "Lock file invalid, running npm install instead..." && npm install); \
    else \
    npm install; \
    fi

# Now copy the rest of the configuration files
COPY nx.json .
COPY project.json .
COPY tsconfig.base.json .

# Copy source files
COPY apps/ ./apps
COPY features/ ./features
COPY libs/ ./libs

# Build the target app
RUN npx nx build radio-script --prod

# -----------------------------------------------------------
# Stage 2: Runtime
# -----------------------------------------------------------
FROM node:latest

WORKDIR /app

ENV NODE_ENV=production

# Copy built application
COPY --from=builder /app/dist/apps/radio-script ./dist

# Copy production dependencies
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json ./

# Install production dependencies
RUN npm ci --omit=dev --ignore-scripts

CMD ["node", "dist/main.js"]