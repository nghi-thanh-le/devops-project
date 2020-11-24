const amqp = require('amqplib/callback_api');
const State = require('./orig-state.js');

const STATE_UPDATE_CHANNEL = 'state-change';
const BROADCASE_MESSAGE_CHANNEL = 'message_queue';
const BROADCASE_MESSAGE_TOPIC = 'my.o';

amqp.connect(process.env.MESSAGE_QUEUE, (error0, connection) => {
    if (error0) {
        throw error0;
    }
    console.log('[*] Connect to rabbitmq from Original')

    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }
        let msgCount = 1;

        channel.assertExchange(BROADCASE_MESSAGE_CHANNEL, 'topic', {
            durable: false
        });

        const timer = setInterval(() => {
            console.log('Current State: ' + State.getState());
            if (State.getState === 'RUNNING' || State.getState() === 'INIT') {
                const sentMsg = `MSG_${msgCount++}`;
                channel.publish(BROADCASE_MESSAGE_CHANNEL, BROADCASE_MESSAGE_TOPIC, Buffer.from(sentMsg));
                console.log(`[x] Sent ${sentMsg} from ORIG`);
            }
        }, 50000);

        channel.assertExchange(STATE_UPDATE_CHANNEL, 'fanout', {
            durable: false
        });

        channel.assertQueue('', {
            exclusive: true
        }, (error2, q) => {
            if (error2) {
                throw error2;
            }
            console.log(`[*] Waiting for messages in ${q.queue}`);
            channel.bindQueue(q.queue, STATE_UPDATE_CHANNEL, '');

            channel.consume(q.queue, (msg) => {
                if (msg.content) {
                    console.log(`[x] ${msg.content.toString()}`);
                    const newState = msg.content === undefined ? State.getState() : msg.content.toString();
                    if (newState === State.getState()) {
                        console.log('Same state as current state, skip do nothing!');
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
