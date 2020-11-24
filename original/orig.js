const amqp = require('amqplib/callback_api');
const State = require('./orig-state.js');

State.setState('RUNNING');
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
            console.log('Current State: ' + State.getState());
            if (State.getState === 'RUNNING' || State.getState() === 'INIT') {
                const sentMsg = `MSG_${msgCount++}`;
                channel.publish(EXCHANGE, key, Buffer.from(sentMsg));
                console.log("[x] Sent %s from ORIG", sentMsg);
            }
        }, 3000);

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
                    const newState = msg.content === undefined ? State.getState() : msg.content.toString();
                    if (newState === State.getState()) {
                        console.log('skip do nothing!');
                    } else {
                        if (newState == 'SHUTDOWN') {
                            console.log('shutting down');
                            State.setState('SHUTDOWN');
                            clearInterval(timer);
                            connection.close();
                            process.exit(0);
                        } else if (newState === 'INIT') {
                            // TODO: up and running
                            const currentState = State.getState();
                            State.setState(newState);
                        } else if (newState === 'RUNNING') {
                            State.setState(newState);
                        } else if (newState === 'PAUSED') {
                            State.setState(newState);
                        }
                    }
                }
            }, {
                noAck: true
            });
        });
    });
});
