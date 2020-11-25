const fs = require('fs');
const os = require('os');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const State = () => {
    const STATE_LOCATION = `${__dirname}/state-db/state.json`;
    const RUNNING_STATE = 'RUNNING';
    const SHUTDOWN_STATE = 'SHUTDOWN';
    const INIT_STATE = 'INIT';
    const DEFAULT_STATE_OBJ = {
        currentState: INIT_STATE
    };

    const adapter = new FileSync(STATE_LOCATION, {
        defaultValue: {
            state: DEFAULT_STATE_OBJ
        }
    });
    const db = low(adapter)

    const logState = (_state = '') => {
        if (_state === '') {
            console.warn('Empty state, skip log');
            return;
        }

        const msgToWrite = `${(new Date()).toISOString()}: ${_state}`;
        console.log(msgToWrite);
        fs.appendFile(`${__dirname}/log/orig-state.log`, `${msgToWrite}${os.EOL}`, { 'flag': 'a' }, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Saved!');
        });
    };
    
    let state = (() => {
        const stateData = db.get('state.currentState', '').value();
        logState(stateData);
        return stateData === '' ? INIT_STATE : stateData;
    })();

    const setState = (newState = '') => {
        if (newState === '') {
            console.warn('assign empty state. skip');
            return;
        }
        state = newState;
        logState(state);

        const newStateData = {
            currentState: state
        };
        db.set('state', newStateData).write();
    };

    const getState = () => {
        return state;
    };

    return {
        INIT_STATE,
        SHUTDOWN_STATE,
        RUNNING_STATE,
        getState, 
        setState };
};

module.exports = State();