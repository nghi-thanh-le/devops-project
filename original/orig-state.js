export default State = (() => {
    let state = '';

    let initState = () => {
        let initialState = 'INIT';
        return initialState;
    };

    return {
        getState: () => {
            if (state === '') {
                state = initState();
            }
            return state;
        },
        setState: (newState = '') {
            if (newState === '') {
                return;
            }
            state = newState;
        }
    };
})();