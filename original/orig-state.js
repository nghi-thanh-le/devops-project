const fs = require('fs');
const os = require('os');

const State = (() => {
    let state = '';
    const INIT_STATE = 'INIT';

    const logState = () => {
        if (state === '') {
            console.warn('Empty state, skip log');
            return;
        }
    
        const msgToWrite = `${(new Date()).toISOString()}: ${state}`;
        // console.log(msgToWrite);
        fs.appendFile(`${__dirname}/log/orig-state.log`, `${msgToWrite}${os.EOL}`, { 'flag': 'a' }, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Saved!');
        });
    };

    const getState = () => {
        if (state === '') {
            state = INIT_STATE;
            logState();
        }
        return state;
    };

    const setState = (newState = '') => {
        if (newState === '') {
            console.warn('assign empty state. skip');
            return;
        }
        state = newState;
        logState();
    };

    return {getState, setState};
})();

module.exports = { State };