FROM node:alpine
WORKDIR /httpenv
COPY package.json /httpenv
COPY package-lock.json /httpenv
COPY server.js /httpenv
ADD log /httpenv
ADD state-db /httpenv
RUN apk update && apk add bash
RUN npm i
RUN npm i -g nodemon
CMD [ "nodemon", "server.js" ]
EXPOSE 8080
