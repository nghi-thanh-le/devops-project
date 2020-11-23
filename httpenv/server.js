const fs = require('fs')
const express = require('express');
const amqp = require('amqplib/callback_api');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

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
  // res.json(db.get('state', {}));
  amqp.connect(process.env.MESSAGE_QUEUE, (error0, connection) => {
    if (error0) {
      throw error0;
    }
    console.log('[*] Connect to rabbitmq from httpenv')

    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      const exchange = 'state';
      const msg = 'SHUTDOWN';

      channel.assertExchange(exchange, 'fanout', {
        durable: false
      });

      channel.publish(exchange, '', Buffer.from(msg));
      console.log(" [x] Sent %s", msg);
      connection.close(); 
    });
  });
  res.send(" [x] Sent message");
});

app.put('state', (req, res) => {
  res.send('Not yet operated');
});

app.listen(8080, () => {
  console.log('server1 is listening on port 8080!');
});
