# -----------------------------------------------------------
# Stage 1: Build
# -----------------------------------------------------------
FROM node:latest AS builder

WORKDIR /app

# Copy Nx + package config from root
COPY nx.json ./
COPY project.json ./
COPY tsconfig.base.json ./
COPY package*.json ./

# Copy your Nx project folders
COPY apps/ ./apps
COPY features/ ./features
COPY libs/ ./libs
# If you have a `tools/` folder or other Nx-related folders, copy them as well
# COPY tools/ ./tools

# Install dependencies (including devDependencies for building)
RUN npm ci

# Now build the target app (replace with your app name)
RUN npx nx run radio-script:build --configuration=test

# -----------------------------------------------------------
# Stage 2: Runtime
# -----------------------------------------------------------
FROM node:latest

WORKDIR /app

ENV NODE_ENV=test

# Copy the build output from the builder stage
COPY --from=builder /app/dist/apps/radio-script ./dist

# Copy package.json files to install only runtime deps
COPY package*.json ./

RUN npm ci --omit=dev

# Run the compiled app
CMD ["node", "dist/main.js"]
