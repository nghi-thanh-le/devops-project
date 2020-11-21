const fs = require('fs');
const os = require('os');

const isEmpty = (obj) => {
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }

    return JSON.stringify(obj) === JSON.stringify({});
};

const State = (() => {
    const STATE_LOCATION = `${__dirname}/state.json`;
    const DEFAULT_STATE = 'RUNNING';
    let state = '';

    const initState = () => {
        // because state.json is small. it's fine to sync access it. 
        const jsonData = (() => {
            try {
                const jsonData = fs.readFileSync(STATE_LOCATION);
                return JSON.parse(jsonData);
            } catch (error) {
                console.error(error);
                fs.writeFile(`${__dirname}/state.json`, JSON.stringify({
                    currentState: 'INIT'
                }), err => {
                    if (err) console.error(err);
                });
                return {};
            }
        })();

        return isEmpty(jsonData) ? DEFAULT_STATE : jsonData.currentState;;
    };

    const logState = () => {
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

    const getState = () => {
        if (state === '') {
            state = initState();
        }
        logState();
        return state;
    };

    const setState = (newState = '') => {
        if (newState === '') {
            console.warn('assign empty state. skip');
            return;
        }
        state = newState;
        logState();

        const newStateData = JSON.stringify({
            currentState: state
        });

        fs.writeFile(`${__dirname}/state.json`, newStateData, 'utf-8', (err, data) => {
            if(err) console.error(err);
        });
    };

    return { getState, setState };
})();

module.exports = { State };