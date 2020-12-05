FROM node:lts-alpine
WORKDIR /httpenv
COPY . /httpenv
RUN apk update && apk add bash
RUN npm i --only=production
RUN npm i -g nodemon
CMD [ "./wait-for-it.sh", "rabbitmq:15672", "-s", "-t", "30", "--", "node", "server.js" ]
EXPOSE 8081
