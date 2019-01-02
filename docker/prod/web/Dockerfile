FROM node:latest as build-stage
WORKDIR /usr/src/app

ARG VUE_APP_SERVER_API
ENV VUE_APP_SERVER_API $VUE_APP_SERVER_API

COPY /client/package*.json ./
RUN npm install
COPY /client .
RUN npm run build

FROM nginx
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
COPY ./docker/prod/web/nginx.conf /etc/nginx/conf.d/default.conf