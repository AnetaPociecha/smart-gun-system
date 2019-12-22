import {put, select, takeLatest} from "@redux-saga/core/effects";
import grid from "../../../utils/grid";
import {
    selectAvailableUnits,
    selectIncidentForUnitId,
    selectSimulationTime,
    selectSupportUnitsCounter
} from "../../selector";
import {
    ADD_LOG,
    ADD_SUPPORT_UNIT,
    CREATE_INCIDENT,
    CREATE_INCIDENT_REQUESTED,
    INCREASE_INCIDENTS_COUNTER, REMOVE_SUPPORT_UNIT, SET_INCIDENT,
    SET_NAVIGATION,
    SET_STATUS
} from "../../types";
import {Status} from "../../reducer/supportUnit";
import selectUnitForRedirection from "../../../utils/selectUnitForRedirection";

function* handleAddIncident(action) {

    const incidentId = yield select(selectSupportUnitsCounter);

    yield put({type: INCREASE_INCIDENTS_COUNTER});
    const activationTime = yield select(selectSimulationTime);
    yield put({type: CREATE_INCIDENT, id: incidentId, location: action.location, activationTime});

    yield put({type: ADD_LOG, log: `Create incident ${incidentId}`});

    let units = yield select(selectAvailableUnits);

    for(const unit of units) {

        yield put({type: ADD_LOG, log: `Assign unit ${unit.id} to incident ${incidentId}`});

        const navigation = grid.findPath(unit.position, action.location);
        yield put({type: SET_NAVIGATION, id: unit.id, navigation});
        yield put({type: SET_STATUS, status: Status.ON_ITS_WAY, id: unit.id,});
        yield put({type: SET_INCIDENT, incident: incidentId, id: unit.id,});

        yield put({type: ADD_SUPPORT_UNIT, id: incidentId, supportUnit: unit.id})
    }

    if(units.length === 0) {
        const redirectUnit = yield select(selectUnitForRedirection(action.location));

        yield put({type: ADD_LOG, log: `Search for unit that can be redirected to incident ${incidentId}`});

        if(redirectUnit) {
            yield put({type: ADD_LOG, log: `Redirect unit ${redirectUnit.id}`});

            const navigation = grid.findPath(redirectUnit.position, action.location);
            yield put({type: SET_NAVIGATION, id: redirectUnit.id, navigation});
            yield put({type: SET_STATUS, status: Status.ON_ITS_WAY, id: redirectUnit.id,});
            yield put({type: SET_INCIDENT, incident: incidentId, id: redirectUnit.id,});

            yield put({type: ADD_SUPPORT_UNIT, id: incidentId, supportUnit: redirectUnit.id});

            const incident = yield select(selectIncidentForUnitId(redirectUnit.id));
            yield put({type: REMOVE_SUPPORT_UNIT, id: incident.id, supportUnit: redirectUnit});
        }
    }

}

export default function* () {
    yield takeLatest(CREATE_INCIDENT_REQUESTED, handleAddIncident)
}