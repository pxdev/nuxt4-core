# ===== Stage 1: Build =====
FROM node:22 AS builder
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install ALL deps (including dev) — required for drizzle-kit
RUN npm install

# Copy all source files
COPY . .

# Run Drizzle generate (works now because dev deps exist)
RUN npm run db:generate

# Build Nuxt app
RUN npm run build

# ===== Stage 2: Run =====
FROM node:22 AS runner
WORKDIR /app

# Copy only what’s needed for runtime
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package*.json ./

# Optional: prune dev deps to make image smaller
RUN npm ci --omit=dev

ENV NITRO_PORT=3000
ENV HOST=0.0.0.0
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
