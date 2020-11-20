const fs = require('fs')
const express = require('express');
const path = require('path');

const app = express();

app.get('/', (req, res) => {
  res.statusCode = 200;
  res.download(`${__dirname}/log/obse.txt`);
});

app.listen(8080, () => {
    console.log('server1 is listening on port 8080!');
});
