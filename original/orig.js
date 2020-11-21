const amqp = require('amqplib/callback_api');
const State = require('./orig-state.js').State;

console.log(`Current State: ${State.getState()}`);
console.log('Switch state to pause');
State.setState('PAUSED');
console.log(`Current State: ${State.getState()}`);
console.log('Switch state to RUNNING');
State.setState('RUNNING');
console.log(`Current State: ${State.getState()}`);

amqp.connect(process.env.MESSAGE_QUEUE, (error0, connection) => {
    if (error0) {
        throw error0;
    }
    console.log('[*] Connect to rabbitmq from Original')

    connection.createChannel((error1, channel) => {
        if(error1) {
            throw error1;
        }
        const EXCHANGE = 'message_queue';
        const key = 'my.o';
        let msgCount = 1;

        channel.assertExchange(EXCHANGE, 'topic', {
            durable: false
        });

        const timer = setInterval(() => {
            const sentMsg = `MSG_${msgCount++}`;
            channel.publish(EXCHANGE, key, Buffer.from(sentMsg));
            console.log(" [x] Sent %s from ORIG", sentMsg);

        }, 100000);
    });
});