FROM node:alpine
WORKDIR /original
COPY package-lock.json /original
COPY package.json /original
COPY orig.js /original
COPY wait-for-it.sh /original
RUN npm i
RUN apk update && apk add bash
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
CMD [ "./wait-for-it.sh", "rabbitmq:15672", "--","node", "orig.js" ]