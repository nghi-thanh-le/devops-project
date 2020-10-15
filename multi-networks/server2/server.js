const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`
        Hello from ${req.client.remoteAddress}:${req.client.remotePort}
        to ${req.client.localAddress}:${req.client.localPort}\n
    `);
});

app.listen(8084, () => {
    console.log('server2 is listening on port 8084!');
});