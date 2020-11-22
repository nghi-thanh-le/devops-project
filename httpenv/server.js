const fs = require('fs')
const express = require('express');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('state-db/state.json', {
  defaultValue: {
      state: {
          currentState: 'INIT'
      }
  }
});
const db = low(adapter)


const app = express();

app.get('/', (req, res) => {
  res.status = 200;
  res.send('Hello World!');
});

app.get('/messages', (req, res) => {
  fs.readFile(`${__dirname}/log/obse.log`, 'utf-8',(e, data) => {
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

app.get('/run-log', (req, res) => {
  fs.readFile(`${__dirname}/log/orig-state.log`, 'utf-8',(e, data) => {
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

app.get('/state', (req, res) => {
  res.send(JSON.stringify(db.get('state', {})));
});

app.put('state', (req, res) => {
  res.send('Not yet operated');
});

app.listen(8080, () => {
    console.log('server1 is listening on port 8080!');
});
