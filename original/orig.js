const amqp = require('amqplib/callback_api');
const State = require('./orig-state.js');
const origFunctions = require('./orig-funcs');

if (
  State.getState() === State.INIT_STATE ||
  State.getState() === State.SHUTDOWN_STATE
) {
  State.setState(State.RUNNING_STATE);
}

amqp.connect(process.env.MESSAGE_QUEUE, (error0, connection) => {
  if (error0) {
    throw error0;
  }
  console.log('[*] Connect to rabbitmq from Original');

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    const intervalBroadcastMessages = origFunctions.broadcastIntervalMessages(
      channel
    );
    origFunctions.subscribeToStateUpdateChannel(
      channel,
      connection,
      intervalBroadcastMessages
    );
  });
});
