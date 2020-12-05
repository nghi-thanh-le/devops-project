const amqp = require('amqplib/callback_api');
const obseFunctions = require('./obse-funcs.js');

amqp.connect(process.env.MESSAGE_QUEUE, (error0, connection) => {
  if (error0) {
    throw error0;
  }
  console.log('[*] Connect to rabbitmq from Ovserver');
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    obseFunctions.listenToTopicAndBroadcast(channel);
    obseFunctions.subscribeToShutdownChannel(channel, connection);
  });
});
