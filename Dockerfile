FROM node:20.9.0-alpine

WORKDIR /usr/app

COPY package.json ./

RUN apk add --no-cache make

COPY . .
