FROM node:14-alpine

# COPY ./entrypoint.sh /entrypoint.sh

WORKDIR /app

COPY ./package.json ./package.json

COPY ./package-lock.json ./package-lock.json

RUN npm i --production

COPY index.js ./index.js

COPY color.js ./color.js

ENTRYPOINT ["sh", "-c", "cd /app && npm start"]