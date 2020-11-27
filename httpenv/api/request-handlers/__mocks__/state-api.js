const getState = (req, res) => {
  res.send('getState is executed');
};
const updateState = (req, res) => {
  res.send('updateState is executed');
};

module.exports = {
    getState,
    updateState
}