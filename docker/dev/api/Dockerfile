FROM node:latest
WORKDIR /usr/src/app
COPY /server/package*.json ./
RUN npm install
RUN npm i -g nodemon
COPY /server .
RUN cd .. && mkdir bin
COPY /docker/bin/wait-for-it.sh ../bin
RUN ["chmod", "+x", "../bin/wait-for-it.sh"]