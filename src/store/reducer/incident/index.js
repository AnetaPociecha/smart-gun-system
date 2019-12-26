import {
    ACTIVATE_HEADQUARTER_ALARM,
    ADD_SUPPORT_UNIT, CLEAR,
    CREATE_INCIDENT, DEACTIVATE_POLICEMAN_ALARM, INCREASE_INCIDENTS_COUNTER,
    REMOVE_ALL_SUPPORT_UNITS,
    REMOVE_INCIDENT,
    REMOVE_SUPPORT_UNIT
} from "../../types";

const initialState = {
    incidents: [
        // {
        //     id: 0,
        //     location: {x: 9, y: 19},
        //     supportUnits: [],
        //     activationTime: 1
        // },
    ],

    counter: 1
};

export default function (state = initialState, action) {

    const incident = action.id && state.incidents.find(item => item.id === action.id);
    const index = incident && state.incidents.indexOf(incident);
    const incidentCopy = incident && copyIncident(incident);
    const allIncidentsCopy = copyAllIncidents(state.incidents);

    switch (action.type) {

        case CREATE_INCIDENT: {
            const newIncident = {
                id: action.id,
                location: action.location,
                supportUnits: [],
                activationTime: action.activationTime
            };
            allIncidentsCopy.push(newIncident);
            return {
                ...state,
                incidents: allIncidentsCopy
            }
        }

        case REMOVE_INCIDENT: {
            const newAllIncidentsCopy = allIncidentsCopy.filter(item => item.id !== action.id);

            return {
                ...state,
                incidents: newAllIncidentsCopy
            }
        }

        case ADD_SUPPORT_UNIT: {

            incidentCopy.supportUnits.push(action.supportUnit);
            allIncidentsCopy[index] = incidentCopy;
            return {
                ...state,
                incidents: allIncidentsCopy
            }
        }

        case REMOVE_SUPPORT_UNIT: {
            incidentCopy.supportUnits = incidentCopy.supportUnits.filter(item => item !== action.supportUnit);
            allIncidentsCopy[index] = incidentCopy;
            return {
                ...state,
                incidents: allIncidentsCopy
            }
        }

        case REMOVE_ALL_SUPPORT_UNITS: {
            incidentCopy.supportUnits = [];
            allIncidentsCopy[index] = incidentCopy;
            return {
                ...state,
                incidents: allIncidentsCopy
            }
        }

        case ACTIVATE_HEADQUARTER_ALARM: {
            incidentCopy.isHeadquarterAlarmOn = true;
            allIncidentsCopy[index] = incidentCopy;
            return {
                ...state,
                incidents: allIncidentsCopy
            }
        }

        case DEACTIVATE_POLICEMAN_ALARM: {
            incidentCopy.isPolicemanAlarmOn = false;
            allIncidentsCopy[index] = incidentCopy;
            return {
                ...state,
                incidents: allIncidentsCopy
            }
        }

        case INCREASE_INCIDENTS_COUNTER: {
            return {
                ...state,
                counter: state.counter + 1
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

const copyIncident = incident => ( incident && {
    id: incident.id,
    location: {...incident.location},
    supportUnits: [...incident.supportUnits],
    activationTime: incident.activationTime,
});

export const copyAllIncidents = incidents => incidents.map(item => copyIncident(item));