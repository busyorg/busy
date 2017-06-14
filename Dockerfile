FROM node:alpine

RUN apk add --update make g++ python

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN yarn install

EXPOSE 3000
CMD npm start
