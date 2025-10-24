# ===== Stage 1: Build =====
FROM node:22 AS builder

WORKDIR /app
COPY . .

# Install dependencies
RUN npm ci

# Build the Nuxt app
RUN npm run build

# ===== Stage 2: Run =====
FROM node:22

WORKDIR /app

# Copy only the build output + necessary files
COPY --from=builder /app/.output ./.output
COPY package*.json ./

ENV NITRO_PORT=3000
ENV HOST=0.0.0.0
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
