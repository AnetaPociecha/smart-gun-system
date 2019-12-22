import {copyAllIncidents} from "../store/reducer/incident";

export default function (state) {

    let incidents = copyAllIncidents(state.incidentsReducer.incidents);

    // check for unhandled -> find oldest

    if (incidents.length > 0) {
        const unhandledIncidents = incidents.filter(incident => incident.supportUnits.length === 0);

        if (unhandledIncidents.length > 0) {
            const oldest = findOldest(unhandledIncidents);
            return oldest;

        } else {
            const oldest = findOldest(incidents);
            return oldest;
        }
    }
}

function findOldest(incidents) {
    let minTime = incidents[0].activationTime;
    let minIncident = incidents[0];

    for (const incident of incidents) {
        if (incident.activationTime < minTime) {
            minTime = incident.activationTime;
            minIncident = incident;
        }
    }
    return minIncident;
}