const amqp = require('amqplib/callback_api');
const fs = require('fs');
const os = require('os');

amqp.connect(process.env.MESSAGE_QUEUE, (error0, connection) => {
    if (error0) {
        throw error0;
    }
    console.log('[*] Connect to rabbitmq from Ovserver')
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

            channel.bindQueue(q.queue, EXCHANGE, "my.*");
            
            channel.consume(q.queue, msg => {
                const msgToWrite = `${(new Date()).toISOString()} Topic ${msg.fields.routingKey}: ${msg.content.toString()}`;
                console.log(msgToWrite);
                fs.appendFile('obse.txt', `${msgToWrite}${os.EOL}`, {'flag': 'a'},(err) => {
                    if (err) throw err;
                    console.log('Saved!');
                  });
            }, {
                noAck: true
            });
        });
    });
});

// const fs = require('fs')
// const express = require('express');

// const app = express();

// app.get('/', (req, res) => {
//   res.statusCode = 200;
//   let content = `${__dirname}/obse.txt`;
//   res.download(content);
// });

// app.listen(8080, () => {
//     console.log('server1 is listening on port 8080!');
// });
