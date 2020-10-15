const amqp = require('amqplib/callback_api');

amqp.connect(process.env.MESSAGE_QUEUE, (error0, connection) => {
    if (error0) {
        throw error0;
    }
    console.log('[*] Connect to rabbitmq from Intermediate')
    connection.createChannel((error1, channel) => {
        if(error1) {
            throw error1;
        }
        const EXCHANGE = 'message_queue';

        channel.assertExchange(EXCHANGE, 'topic', {
            durable: false
        });

        channel.assertQueue('', {
            exclusive: true
        }, (error2, q) => {
            if (error2) throw error2;

            channel.bindQueue(q.queue, EXCHANGE, "my.o");
            
            channel.consume(q.queue, msg => {
                setTimeout(() => {
                    const msgToSend = `Got: ${msg.content.toString()}`
                    console.log(msgToSend);
                    channel.publish(EXCHANGE, "my.i", Buffer.from(msgToSend));
                }, 1000);
            }, {
                noAck: true
            });
        });
    });
});