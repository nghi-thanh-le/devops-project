FROM node:alpine
WORKDIR /observer
COPY package.json /observer
COPY package-lock.json /observer
COPY obse.js /observer
COPY obse-constants.js /observer
COPY obse-funcs.js /observer
COPY wait-for-it.sh /observer
ADD log /observer
RUN npm i
RUN npm i -g nodemon
RUN apk update && apk add bash
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
CMD [ "./wait-for-it.sh", "rabbitmq:15672", "-s", "-t", "30", "--","nodemon", "obse.js" ]
