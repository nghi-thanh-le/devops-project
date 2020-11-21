const fs = require('fs')
const express = require('express');
const path = require('path');

const app = express();

app.get('/', (req, res) => {
  res.status = 200;
  res.send('Hello World!');
});

app.get('/messages', (req, res) => {
  fs.readFile(`${__dirname}/log/obse.txt`, 'utf-8',(e, data) => {
    if (e) {
      console.error(e);
      res.statusCode = 400;
      res.send(e);
    } else {
      res.statusCode = 200;
      res.send(data);
    }
  });
});

app.listen(8080, () => {
    console.log('server1 is listening on port 8080!');
});
