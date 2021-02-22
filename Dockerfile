FROM node:alpine

RUN apk add  --no-cache ffmpeg
RUN mkdir /podcasts-download

ENV PODCAST_FEEDS=http://192.168.1.39:3000/podcast
ENV PODCAST_DIR=/podcasts-download
ENV PODCAST_RUN_TIME="30 * * * *"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "index.js" ]