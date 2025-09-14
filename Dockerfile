ARG NODE_VERSION=20.9.0
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/app

FROM base AS deps
COPY .yarn .yarn
COPY .yarnrc.yml package.json yarn.lock ./
COPY Database ./Database
COPY prisma.config.ts ./prisma.config.ts
RUN --mount=type=cache,target=/usr/app/.yarn/cache \
    yarn install --immutable --inline-builds
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=binary
RUN yarn prisma generate

FROM deps AS build
COPY . .
RUN yarn build

FROM base AS final
ENV NODE_ENV=production
COPY --from=deps /usr/app/node_modules ./node_modules
COPY --from=build /usr/app/dist ./dist
COPY package.json yarn.lock .yarn .yarnrc.yml ./
CMD ["yarn", "start:prod"]
