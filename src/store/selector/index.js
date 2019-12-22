import {Status} from "../reducer/supportUnit";

export const selectSupportUnitsCounter = state => state.incidentsReducer.counter;
export const selectSimulationTime = state => state.simulationReducer.time;

export const selectAvailableUnits = state => state.supportUnitsReducer.supportUnits.filter(unit => unit.status === Status.AVAILABLE);
export const selectOnTheirWayUnits = state => state.supportUnitsReducer.supportUnits.filter(unit => unit.status === Status.ON_ITS_WAY);

export const selectUnitsByIncident = incident => state => state.supportUnitsReducer.supportUnits
    .filter(unit => unit.incident && unit.incident === incident);

export const selectIncidentForUnitId = id => state => state.incidentsReducer.incidents.find(incident => incident.supportUnits.includes(id));

export const selectUnitById = id => state => state.supportUnitsReducer.supportUnits.find(unit => unit.id === id);