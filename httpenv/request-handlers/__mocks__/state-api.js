const getState = (req, res) => {
    return res.json({
        currentState: '123'
    });
};

module.exports = {
    getState
}