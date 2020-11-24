const fs = require('fs')
const express = require('express');
const amqp = require('amqplib/callback_api');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('state-db/state.json', {
  defaultValue: {
    state: {
      currentState: 'INIT'
    }
  }
});
const db = low(adapter)
const app = express();
const VALID_STATES = ['SHUTDOWN', 'INIT', 'PAUSED', 'RUNNING'];

app.use(bodyParser.json());

app.get('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/messages', (req, res) => {
  fs.readFile(`${__dirname}/log/obse.log`, 'utf-8', (e, data) => {
    if (e) {
      console.error(e);
      res.statusCode = 400;
      res.send(e);
    } else {
      res.statusCode = 200;
      res.send(data);
    }
  });
});

app.get('/run-log', (req, res) => {
  fs.readFile(`${__dirname}/log/orig-state.log`, 'utf-8', (e, data) => {
    if (e) {
      console.error(e);
      res.statusCode = 400;
      res.send(e);
    } else {
      res.statusCode = 200;
      res.send(data);
    }
  });
});

app.get('/state', (req, res) => {
  res.json(db.get('state', {}));
});

app.put('/state', (req, res) => {
  const exchange = 'state';
  const newState = req.body.hasOwnProperty('newState') ? req.body.newState.toUpperCase() : '';

  if (newState === '' | !VALID_STATES.includes(newState)) {
    res.status(400);
    res.json({
      message: 'Invalid state'
    });
    return;
  }

  amqp.connect(process.env.MESSAGE_QUEUE, (error0, connection) => {
    if (error0) {
      console.error(error0);
      res.status(500);
      res.json({
        message: 'Error while tring to set state'
      });
      connection.close();
      return;
    }

    console.log('[*] Connect to rabbitmq from httpenv');
    connection.createChannel((error1, channel) => {
      if (error1) {
        console.error(error1);
        res.status(500);
        res.json({
          message: 'Error while tring to set state'
        });
        connection.close();
        return;
      }

      channel.assertExchange(exchange, 'fanout', {
        durable: false
      });

      channel.publish(exchange, '', Buffer.from(newState));
      console.log(`[x] Sent ${newState}`);
      res.status(200);
      res.json({
        message: 'Set state done!'
      })
      setTimeout(function() { 
        connection.close();
      }, 500);
    });
  });
});

app.listen(8080, () => {
  console.log('server1 is listening on port 8080!');
});
