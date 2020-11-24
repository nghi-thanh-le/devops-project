FROM node:alpine
WORKDIR /httpenv
COPY package.json /httpenv
COPY package-lock.json /httpenv
COPY server.js /httpenv
COPY swagger.json /httpenv
COPY wait-for-it.sh /httpenv
ADD log /httpenv
ADD state-db /httpenv
RUN apk update && apk add bash
RUN npm i
RUN npm i -g nodemon
# CMD [ "nodemon", "server.js" ]
CMD [ "./wait-for-it.sh", "rabbitmq:15672", "-s", "-t", "30", "--","nodemon", "server.js" ]
EXPOSE 8080
