import {CLEAR, STEP} from "../../types";

const initialState = {
    time: 0
};

export default function (state = initialState, action) {
    switch (action.type) {
        case STEP: {
            return {
                ...state,
                time: state.time + 1
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