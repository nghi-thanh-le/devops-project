const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const bodyParser = require('body-parser');
const logHandlers = require('./request-handlers/log-messages.js');
const stateHandlers = require('./request-handlers/state-api.js');
const app = express();

app.use(bodyParser.json());

// TODO: update swagger.json to generate doc
app.get('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

app.listen(8080, () => {
  console.log('httpenv is listening on port 8081!');
});