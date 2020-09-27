const express = require('express');
const axios = require('axios');

const app = express();

app.get('/', (req, res) => {
    axios.get('http://172.28.0.5:8084').then((response) => {
        res.send(`
            Hello from ${req.client.remoteAddress}:${req.client.remotePort}
            to ${req.client.localAddress}:${req.client.localPort}\n
            Response of the above request to Service2
            ${response.data}
        `);
    }).catch(error => {
        res.send(error);
    });
});

app.listen(8002, () => {
    console.log('server1 is listening on port 8081!');
});