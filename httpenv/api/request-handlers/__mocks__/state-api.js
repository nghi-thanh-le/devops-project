const getState = (req, res) => {
    return res.json({
        currentState: '123'
    });
};

const getState = (req, res) => {
    return '123';
}

module.exports = {
    getState,
    setState
}