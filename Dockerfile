FROM node:22 AS development

# https://typicode.github.io/husky/how-to.html#ci-server-and-docker
ENV HUSKY=0

WORKDIR /app

COPY --chown=node:node .npmrc ./
COPY --chown=node:node package*.json ./

RUN npm ci

USER node

FROM node:22 AS build

WORKDIR /app

COPY --chown=node:node .npmrc ./
COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /app/node_modules ./node_modules

COPY --chown=node:node . ./
COPY --chown=node:node tsconfig*.json ./

ENV NODE_ENV production

RUN npm run build

RUN npm prune --production

USER node

FROM node:22-alpine AS production

ENV PORT=80
ENV HOST=0.0.0.0

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.output ./.output

EXPOSE 80

ENTRYPOINT ["node", ".output/server/index.mjs"]
