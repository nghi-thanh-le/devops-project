const amqp = require('amqplib/callback_api');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const DB_LOCATION = path.resolve(`${__dirname}/../state-db/state.json`);
const DEFAULT_VALUE = {
  state: {
    currentState: 'INIT',
  },
};

const adapter = new FileSync(DB_LOCATION, {
  defaultValue: DEFAULT_VALUE,
});

const db = low(adapter);
const VALID_STATES = ['SHUTDOWN', 'PAUSED', 'RUNNING'];
const BROADCAST_CHANEL = 'state-change';

const getState = (req, res) => {
  res.json(db.get('state', DEFAULT_VALUE).value());
};

const updateState = (req, res) => {
  const newState = Object.prototype.hasOwnProperty.call(req.body, 'newState')
    ? req.body.newState.toUpperCase()
    : '';

  if (newState === '' || !VALID_STATES.includes(newState)) {
    res.status(400);
    res.json({
      message: 'Invalid state',
    });
    return;
  }

  amqp.connect(process.env.MESSAGE_QUEUE, (error0, connection) => {
    if (error0) {
      console.error(error0);
      res.status(500);
      res.json({
        message: 'Error while tring to set state',
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
          message: 'Error while tring to set state',
        });
        connection.close();
        return;
      }

      channel.assertExchange(BROADCAST_CHANEL, 'fanout', {
        durable: false,
      });

      channel.publish(BROADCAST_CHANEL, '', Buffer.from(newState));
      console.log(`[x] Sent ${newState}`);
      res.status(200);
      res.json({
        message: 'Set state done!',
      });
      setTimeout(() => {
        connection.close();
        process.exit(1);
      }, 500);
    });
  });
};

module.exports = {
  getState,
  updateState,
};
