FROM node:alpine
WORKDIR /intermediate
COPY package-lock.json /intermediate
COPY package.json /intermediate
COPY imed.js /intermediate
COPY wait-for-it.sh /intermediate
RUN apk update && apk add bash
RUN npm i
RUN npm i -g nodemon
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
CMD [ "./wait-for-it.sh", "rabbitmq:15672", "--","nodemon", "imed.js" ]