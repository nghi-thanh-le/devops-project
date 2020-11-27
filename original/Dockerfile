FROM node:lts-alpine
WORKDIR /original
COPY . /original
RUN apk update && apk add bash
RUN npm i --only=production
RUN npm i -g nodemon
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
CMD [ "./wait-for-it.sh", "rabbitmq:15672", "-s", "-t", "25", "--","node", "orig.js" ]