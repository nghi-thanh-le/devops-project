FROM node:alpine
WORKDIR /httpenv
COPY package.json /httpenv
COPY package-lock.json /httpenv
COPY server.js /httpenv
RUN apk update && apk add bash
RUN npm i
CMD [ "node", "server.js" ]
EXPOSE 8080
