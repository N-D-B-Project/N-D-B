FROM node:20.6.1-alpine AS node

WORKDIR /usr/app

COPY package.json ./

RUN apk add --no-cache make

COPY . .
