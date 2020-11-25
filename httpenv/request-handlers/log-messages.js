const fs = require('fs')
const path = require('path');
const OBSE_LOG_LOCATION = path.resolve(`${__dirname}/../log/obse.log`);
const ORIG_STATE_LOG_LOCATION = path.resolve(`${__dirname}/../log/orig-state.log`);

const readFileThenSendBack = (fileLocation, req, res) => {
  fs.readFile(fileLocation, 'utf-8', (e, data) => {
    if (e) {
      console.error(e);
      res.statusCode = 400;
      res.send(e);
    } else {
      res.statusCode = 200;
      res.send(data);
    }
  });
}

const obseLogHanlder = (req, res) => {
  readFileThenSendBack(OBSE_LOG_LOCATION, req, res);
};

const origStateLogHanlder = (req, res) => {
  readFileThenSendBack(ORIG_STATE_LOG_LOCATION, req, res);
};

module.exports = {
  obseLogHanlder,
  origStateLogHanlder
}