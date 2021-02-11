FROM node:alpine

RUN apk add  --no-cache ffmpeg

WORKDIR /usr/src/app/podcasts  
RUN mkdir /podcasts-download

COPY package*.json ./

RUN npm install

COPY . . 
COPY podcasts.config.json . 

ENV PODCAST_FEEDS=http://caladan:8100/podcast
ENV PODCAST_DIR=/podcasts-download

CMD [ "node", "/usr/src/app/podcasts/index.js" ]