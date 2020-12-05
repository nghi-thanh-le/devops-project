const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const logHandlers = require('./request-handlers/log-messages');
const stateHandlers = require('./request-handlers/state-api');

const app = express();

app.use(bodyParser.json());
app.use(swaggerUi.serve);

// logger setup
const accessLogStream = fs.createWriteStream(
  path.resolve(`${__dirname}/log/access.log`),
  { flags: 'a' }
);
app.use(morgan('tiny', { stream: accessLogStream }));

// TODO: update swagger.json to generate doc
app.get('/', swaggerUi.setup(swaggerDocument));

app.get('/messages', (req, res) => {
  logHandlers.obseLogHanlder(req, res);
});

app.get('/run-log', (req, res) => {
  logHandlers.origStateLogHanlder(req, res);
});

app.get('/state', (req, res) => {
  stateHandlers.getState(req, res);
});

app.put('/state', (req, res) => {
  stateHandlers.updateState(req, res);
});

module.exports = app;
