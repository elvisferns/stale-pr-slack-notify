FROM node:14-alpine

LABEL "actionContainer"=true

WORKDIR /app

COPY ./package.json ./package.json

COPY ./package-lock.json ./package-lock.json

RUN npm i --production

COPY ./index.js ./index.js

ENTRYPOINT [ "npm", "start" ]