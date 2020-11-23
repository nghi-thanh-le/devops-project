const amqp = require('amqplib/callback_api');
const State = require('./orig-state.js');

State.getState();
let running = true;

amqp.connect(process.env.MESSAGE_QUEUE, (error0, connection) => {
    if (error0) {
        throw error0;
    }
    console.log('[*] Connect to rabbitmq from Original')

    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }
        const EXCHANGE = 'message_queue';
        const SHUTDOWN_EXCHANGE = 'state';
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

        channel.assertExchange(SHUTDOWN_EXCHANGE, 'fanout', {
            durable: false
        });

        channel.assertQueue('', {
            exclusive: true
        }, function (error2, q) {
            if (error2) {
                throw error2;
            }
            console.log("[*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
            channel.bindQueue(q.queue, SHUTDOWN_EXCHANGE, '');

            channel.consume(q.queue, function (msg) {
                if (msg.content) {
                    console.log(" [x] %s", msg.content.toString());
                    if (msg.content == 'SHUTDOWN') {
                        console.log('shutting down');
                        clearInterval();
                        connection.close();
                        process.exit(0);
                    } else if (msg.content === 'INIT' || msg.content === 'RUNNING') {
                        // TODO: up and running
                    }
                }
            }, {
                noAck: true
            });
        });
    });
});
