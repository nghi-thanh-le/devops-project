const fs = require('fs');
const os = require('os');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const isEmpty = (obj) => {
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }

    return JSON.stringify(obj) === JSON.stringify({});
};

const State = (() => {
    const STATE_LOCATION = `${__dirname}/state-db/state.json`;
    const DEFAULT_STATE = 'RUNNING';
    const DEFAULT_INIT_STATE = 'INIT';

    const adapter = new FileSync('state-db/state.json', {
        defaultValue: {
            state: {
                currentState: DEFAULT_INIT_STATE
            }
        }
    });
    const db = low(adapter)
    
    let state = '';

    const initState = () => {
        // because state.json is small. it's fine to sync modify it. 
        const jsonData = db.get('state', {});
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

        const newStateData = {
            currentState: state
        };
        db.set('state', newStateData).write();
    };

    return { getState, setState };
})();

module.exports = { State };