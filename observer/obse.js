const amqp = require('amqplib/callback_api');
const fs = require('fs');
const os = require('os');
const OBSE_CONSTANTS = require('./obse-constants.js');

amqp.connect(process.env.MESSAGE_QUEUE, (error0, connection) => {
    if (error0) {
        throw error0;
    }
    console.log('[*] Connect to rabbitmq from Ovserver')
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }

        channel.assertExchange(OBSE_CONSTANTS.BROADCAST_MESSAGE_CHANNEL, 
                               OBSE_CONSTANTS.BROADCAST_MESSAGE_TYPE, {
            durable: false
        });

        channel.assertQueue('', {
            exclusive: true
        }, (error2, q) => {
            if (error2) throw error2;

            channel.bindQueue(q.queue, 
                              OBSE_CONSTANTS.BROADCAST_MESSAGE_CHANNEL, 
                              OBSE_CONSTANTS.BROADCAST_MESSAGE_TOPIC);

            channel.consume(q.queue, msg => {
                const msgToWrite = `${(new Date()).toISOString()} Topic ${msg.fields.routingKey}: ${msg.content.toString()}`;
                console.log(msgToWrite);
                fs.appendFile(`${__dirname}/log/obse.log`, `${msgToWrite}${os.EOL}`, { 'flag': 'a' }, (err) => {
                    if (err) throw err;
                    console.log('Saved!');
                });
            }, {
                noAck: true
            });
        });

        channel.assertExchange(OBSE_CONSTANTS.STATE_UPDATE_CHANNEL, 
                               OBSE_CONSTANTS.STATE_UPDATE_TYPE, {
            durable: false
        });

        channel.assertQueue('', {
            exclusive: true
        }, (error2, q) => {
            if (error2) {
                throw error2;
            }
            console.log(`[*] Waiting for messages in ${q.queue}`);
            channel.bindQueue(q.queue, OBSE_CONSTANTS.STATE_UPDATE_CHANNEL, '');

            channel.consume(q.queue, (msg) => {
                if (msg.content) {
                    console.log(`[x] ${msg.content.toString()}`);
                    const newState = msg.content === undefined ? '' : msg.content.toString();
                    if (newState !== OBSE_CONSTANTS.STATE_SHUTDOWN) {
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