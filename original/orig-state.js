const fs = require('fs');
const os = require('os');

const State = (() => {
    let state = '';

    let initState = () => {
        let initialState = 'INIT';
        return initialState;
    };

    let logState = () => {
        if (state === '') {
            console.warn('Empty state, skip log');
            return;
        }
    
        const msgToWrite = `${(new Date()).toISOString()}: ${state}`;
        console.log(msgToWrite);
        fs.appendFile(`${__dirname}/log/orig-state.log`, `${msgToWrite}${os.EOL}`, { 'flag': 'a' }, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Saved!');
        });
    };

    let getState = () => {
        if (state === '') {
            state = initState();
            logState();
        }
        return state;
    };

    let setState = (newState = '') => {
        if (newState === '') {
            console.warn('assign empty state. skip');
            return;
        }
        logState();
        state = newState;
    };

    return {getState, setState};
})();

module.exports = { State };