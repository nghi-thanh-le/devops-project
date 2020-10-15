FROM node:alpine
WORKDIR /observer
COPY package.json /observer
COPY package-lock.json /observer
COPY server.js /observer
COPY wait-for-it.sh /observer
RUN npm i
RUN apk update && apk add bash
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
CMD [ "./wait-for-it.sh", "rabbitmq:15672", "--","npm", "run", "start" ]
EXPOSE 8080
