const amqp = require('amqplib/callback_api');
const IMED_CONSTNATS = require('./imed-constants.js');

amqp.connect(process.env.MESSAGE_QUEUE, (error0, connection) => {
    if (error0) {
        throw error0;
    }
    console.log('[*] Connect to rabbitmq from Intermediate')
    connection.createChannel((error1, channel) => {
        if(error1) {
            throw error1;
        }

        channel.assertExchange(IMED_CONSTNATS.BROADCAST_MESSAGE_CHANNEL, 
                               IMED_CONSTNATS.BROADCAST_MESSAGE_TYPE, {
            durable: false
        });

        channel.assertQueue('', {
            exclusive: true
        }, (error2, q) => {
            if (error2) throw error2;

            channel.bindQueue(q.queue, 
                IMED_CONSTNATS.BROADCAST_MESSAGE_CHANNEL, 
                IMED_CONSTNATS.BROADCAST_MESSAGE_TOPIC);
            
            channel.consume(q.queue, msg => {
                setTimeout(() => {
                    const msgToSend = `Got: ${msg.content.toString()}`
                    console.log(msgToSend);
                    channel.publish(IMED_CONSTNATS.BROADCAST_MESSAGE_CHANNEL, IMED_CONSTNATS.BROADCAST_MESSAGE_TOPIC, Buffer.from(msgToSend));
                }, 1000);
            }, {
                noAck: true
            });
        });

        channel.assertExchange(IMED_CONSTNATS.STATE_UPDATE_CHANNEL, 
                               IMED_CONSTNATS.STATE_UPDATE_TYPE, {
            durable: false
        });

        channel.assertQueue('', {
            exclusive: true
        }, (error2, q) => {
            if (error2) {
                throw error2;
            }
            console.log(`[*] Waiting for messages in ${q.queue}`);
            channel.bindQueue(q.queue, IMED_CONSTNATS.STATE_UPDATE_CHANNEL, '');

            channel.consume(q.queue, (msg) => {
                if (msg.content) {
                    console.log(`[x] ${msg.content.toString()}`);
                    const newState = msg.content === undefined ? '' : msg.content.toString();
                    if (newState !== IMED_CONSTNATS.STATE_SHUTDOWN) {
                        console.log('Invalid state, skip do nothing!');
                    } else {
                        console.log('shutting down');
                        connection.close();
                        process.exit(0);
                    }
                }
            }, {
                noAck: true
            });
        });
    });
});