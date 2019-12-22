import {
    CLEAR,
    CLEAR_INCIDENT,
    CLEAR_NAVIGATION, SET_AVAILABLE_STATUS,
    SET_INCIDENT,
    SET_NAVIGATION,
    SET_POSITION,
    SET_STATUS, STEP
} from "../../types";

export const Status = Object.freeze({
    AVAILABLE: Symbol("available"),
    ON_ITS_WAY: Symbol("onItsWay"),
    ON_THE_SPOT: Symbol("onTheSpot")
});

const initialState = {
    supportUnits: [
        {
            id: 1,
            position: {x: 14, y: 28},
            navigation: [],
            status: Status.AVAILABLE,
            incident: undefined
        },
        {
            id: 2,
            position: {x: 9, y: 0},
            navigation: [],
            status: Status.AVAILABLE,
            incident: undefined
        },
        {
            id: 3,
            position: {x: 0, y: 14},
            navigation: [],
            status: Status.AVAILABLE,
            incident: undefined
        }
    ]
};

export default function (state = initialState, action) {

    const unit = state.supportUnits.find(item => item.id === action.id);
    const index = state.supportUnits.indexOf(unit);
    const unitCopy = copyUnit(unit);

    const allUnitsCopy = copySupportUnits(state.supportUnits);

    switch (action.type) {

        case SET_POSITION: {

            unitCopy.position = action.position;
            allUnitsCopy[index] = unitCopy;

            return {
                ...state,
                supportUnits: allUnitsCopy
            }
        }
        case SET_NAVIGATION: {
            unitCopy.navigation = action.navigation;
            allUnitsCopy[index] = unitCopy;

            return {
                ...state,
                supportUnits: allUnitsCopy
            }
        }
        case CLEAR_NAVIGATION: {
            unitCopy.navigation = [];
            allUnitsCopy[index] = unitCopy;

            return {
                ...state,
                supportUnits: allUnitsCopy
            }
        }
        case SET_STATUS: {
            unitCopy.status = action.status;
            allUnitsCopy[index] = unitCopy;

            return {
                ...state,
                supportUnits: allUnitsCopy
            }
        }
        case SET_AVAILABLE_STATUS: {
            unitCopy.status = Status.AVAILABLE;
            allUnitsCopy[index] = unitCopy;

            return {
                ...state,
                supportUnits: allUnitsCopy
            }
        }
        case SET_INCIDENT: {
            unitCopy.incident = action.incident;
            allUnitsCopy[index] = unitCopy;

            return {
                ...state,
                supportUnits: allUnitsCopy
            }
        }
        case CLEAR_INCIDENT: {
            unitCopy.incident = undefined;
            allUnitsCopy[index] = unitCopy;

            return {
                ...state,
                supportUnits: allUnitsCopy
            }
        }

        case STEP: {

            const movedUnits = state.supportUnits
                .filter(unit => unit.navigation.length > 0)
                .map(unit => {
                    const newUnit = copyUnit(unit);
                    const newPosition = {...unit.navigation[0]};
                    newUnit.navigation.shift();
                    newUnit.position = newPosition;
                    return newUnit
                });

            const newOnTheSpotUnits = state.supportUnits
                .filter(unit => unit.navigation.length === 0 && unit.status === Status.ON_ITS_WAY)
                .map(unit => {
                    const newUnit = copyUnit(unit);
                    newUnit.status = Status.ON_THE_SPOT;
                    return newUnit
                });

            const otherUnits = state.supportUnits.filter(unit => unit.navigation.length === 0 && unit.status !== Status.ON_ITS_WAY);

            return {
                ...state,
                supportUnits: [...movedUnits, ...newOnTheSpotUnits, ...otherUnits]
            }
        }

        case CLEAR: {
            return initialState
        }

        default: {
            return state;
        }
    }
}

const copyUnit = unit => (
    unit && {
        id: unit.id,
        position: {...unit.position},
        navigation: unit.navigation.map(item => ({...item})),
        status: unit.status,
        incident: unit.incident
    }
);

export const copySupportUnits = units => units.map(unit => copyUnit(unit));
