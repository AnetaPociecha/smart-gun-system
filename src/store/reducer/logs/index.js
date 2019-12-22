import {ADD_LOG, CLEAR} from "../../types";

const initialState = {
    logs: []
};

export default function (state = initialState, action) {
    switch (action.type) {

        case ADD_LOG: {
            const logsCopy = [...state.logs];
            logsCopy.unshift(action.log);
            return {
                logs: logsCopy
            }
        }

        case CLEAR: {
            return initialState
        }
        default: {
            return state
        }
    }
}