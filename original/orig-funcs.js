const ORIG_CONSTANTS = require('./orig-constants.js');
const State = require('./orig-state.js');

const broadcastIntervalMessages = (channel) => {
    let msgCount = 1;

        channel.assertExchange(ORIG_CONSTANTS.BROADCAST_MESSAGE_CHANNEL, ORIG_CONSTANTS.BROADCAST_MESSAGE_TYPE, {
            durable: false
        });

    const timer = setInterval(() => {
        console.log('Current State: ' + State.getState());
        if (State.getState() === State.RUNNING_STATE) {
            const sentMsg = `MSG_${msgCount++}`;
            channel.publish(ORIG_CONSTANTS.BROADCAST_MESSAGE_CHANNEL, ORIG_CONSTANTS.BROADCAST_MESSAGE_TOPIC, Buffer.from(sentMsg));
            console.log(`[x] Sent ${sentMsg} from ORIG`);
        }
    }, 25000);

    return timer;
};

const subscribeToStateUpdateChannel = (channel, connection, intervalMessages) => {
    channel.assertExchange(ORIG_CONSTANTS.STATE_UPDATE_CHANNEL, ORIG_CONSTANTS.STATE_UPDATE_TYPE, {
        durable: false
    });

    channel.assertQueue('', {
        exclusive: true
    }, (error2, q) => {
        if (error2) {
            throw error2;
        }
        console.log(`[*] Waiting for messages in ${q.queue}`);
        channel.bindQueue(q.queue, ORIG_CONSTANTS.STATE_UPDATE_CHANNEL, '');

        channel.consume(q.queue, (msg) => {
            if (msg.content) {
                console.log(`[x] ${msg.content.toString()}`);
                const newState = msg.content === undefined ? State.getState() : msg.content.toString();
                if (newState === State.getState()) {
                    console.log('Same state as current state, skip do nothing!');
                } else {
                    State.setState(newState);
                    if (newState === State.SHUTDOWN_STATE) {
                        console.log('shutting down');
                        clearInterval(intervalMessages);
                        connection.close();
                        process.exit(0);
                    }
                }
            }
        }, {
            noAck: true
        });
    });
};

module.exports = {
    broadcastIntervalMessages,
    subscribeToStateUpdateChannel}