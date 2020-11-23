FROM node:lts-alpine
WORKDIR /original
COPY package-lock.json /original
COPY package.json /original
COPY orig.js /original
COPY orig-state.js /original
COPY wait-for-it.sh /original
ADD log /original
ADD state-db /original
RUN npm i
RUN npm i -g nodemon
RUN apk update && apk add bash
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
# CMD [ "./wait-for-it.sh", "rabbitmq:15672", "--","nodemon", "orig.js" ]
# CMD ["nodemon", "--ignore", "state-db", "orig.js" ]
CMD [ "./wait-for-it.sh", "rabbitmq:15672", "--","node", "orig.js" ]