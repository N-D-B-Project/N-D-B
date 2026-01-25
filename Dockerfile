ARG NODE_VERSION=20.9.0
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/app

FROM base AS deps-dev

COPY .yarn .yarn
COPY .yarnrc.yml package.json yarn.lock nest-cli.json ./
COPY Database ./Database
COPY prisma.config.ts ./prisma.config.ts
COPY scripts scripts

RUN --mount=type=cache,target=/usr/app/.yarn/cache \
    yarn install --immutable --inline-builds

ENV PRISMA_CLI_QUERY_ENGINE_TYPE=binary

RUN yarn prisma generate

FROM deps-dev AS build

COPY . .

RUN yarn build

FROM base AS deps-prod

COPY .yarn .yarn
COPY scripts scripts
COPY .yarnrc.yml package.json yarn.lock ./

RUN --mount=type=cache,target=/usr/app/.yarn/cache \
  yarn workspaces focus --production

FROM base AS final

ENV NODE_ENV=production

COPY --from=deps-prod /usr/app/node_modules ./node_modules
COPY --from=deps-dev /usr/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /usr/app/dist ./dist
COPY package.json yarn.lock .yarn .yarnrc.yml ./

CMD ["node", "dist/src/main"]
