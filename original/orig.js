const amqp = require('amqplib/callback_api');

// amqp.connect("amqp://localhost", (error0, connection) => {
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

            if (msgCount > 3) {
                clearInterval(timer);
            }
        }, 3000);
    });
});