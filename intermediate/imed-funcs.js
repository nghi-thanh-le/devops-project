const {
  STATE_UPDATE_CHANNEL,
  STATE_UPDATE_TYPE,
  STATE_SHUTDOWN,
  BROADCAST_MESSAGE_CHANNEL,
  BROADCAST_MESSAGE_TOPIC,
  BROADCAST_MESSAGE_TYPE,
} = require('./imed-constants.js');

const listenToTopicAndBroadcast = (channel) => {
  channel.assertExchange(BROADCAST_MESSAGE_CHANNEL, BROADCAST_MESSAGE_TYPE, {
    durable: false,
  });

  channel.assertQueue('', { exclusive: true }, (error2, q) => {
    if (error2) throw error2;

    channel.bindQueue(
      q.queue,
      BROADCAST_MESSAGE_CHANNEL,
      BROADCAST_MESSAGE_TOPIC
    );

    channel.consume(
      q.queue,
      (msg) => {
        setTimeout(() => {
          const msgToSend = `Got: ${msg.content.toString()}`;
          console.log(msgToSend);
          channel.publish(
            BROADCAST_MESSAGE_CHANNEL,
            BROADCAST_MESSAGE_TOPIC,
            Buffer.from(msgToSend)
          );
        }, 1000);
      },
      { noAck: true }
    );
  });
};

const subscribeToShutdownChannel = (channel, connection) => {
  channel.assertExchange(STATE_UPDATE_CHANNEL, STATE_UPDATE_TYPE, {
    durable: false,
  });

  channel.assertQueue('', { exclusive: true }, (error2, q) => {
    if (error2) {
      throw error2;
    }

    console.log(`[*] Waiting for messages in ${q.queue}`);
    channel.bindQueue(q.queue, STATE_UPDATE_CHANNEL, '');

    channel.consume(
      q.queue,
      (msg) => {
        if (msg.content) {
          console.log(`[x] ${msg.content.toString()}`);
          const newState =
            msg.content === undefined ? '' : msg.content.toString();
          if (newState !== STATE_SHUTDOWN) {
            console.log('Invalid state, skip do nothing!');
          } else {
            console.log('shutting down');
            connection.close();
            process.exit(0);
          }
        }
      },
      { noAck: true }
    );
  });
};

module.exports = {
  listenToTopicAndBroadcast,
  subscribeToShutdownChannel,
};
