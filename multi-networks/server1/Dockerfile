FROM node:10
WORKDIR /app
COPY package.json /app
COPY server.js /app
RUN npm i
CMD node server.js
EXPOSE 8001