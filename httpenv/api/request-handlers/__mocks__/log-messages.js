const obseLogHanlder = (req, res) => {
  res.send('obseLogHanlder is executed');
};
const origStateLogHanlder = (req, res) => {
  res.send('origStateLogHanlder is executed');
};

module.exports = {
  obseLogHanlder,
  origStateLogHanlder,
};
