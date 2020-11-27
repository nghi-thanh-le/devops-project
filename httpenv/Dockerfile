FROM node:lts-alpine
WORKDIR /httpenv
COPY . /httpenv
RUN apk update && apk add bash
RUN npm i --force
RUN npm i -g nodemon
CMD [ "nodemon", "server.js" ]
# CMD [ "./wait-for-it.sh", "rabbitmq:15672", "-s", "-t", "30", "--","nodemon", "server.js" ]
EXPOSE 8081
