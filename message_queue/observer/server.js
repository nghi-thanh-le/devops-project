const fs = require('fs')
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.statusCode = 200;
  let content = `${__dirname}/obse.txt`;
  res.download(content);
});

app.listen(8080, () => {
    console.log('server1 is listening on port 8080!');
});
