const amqp = require('amqplib/callback_api');
const imedFunctions = require('./imed-funcs.js');

amqp.connect(process.env.MESSAGE_QUEUE, (error0, connection) => {
    if (error0) {
        throw error0;
    }
    console.log('[*] Connect to rabbitmq from Intermediate')
    connection.createChannel((error1, channel) => {
        if(error1) {
            throw error1;
        }

        imedFunctions.listenToTopicAndBroadcast(channel);
        imedFunctions.subscribeToShutdownChannel(channel, connection);
    });
});