import {put, select, takeLatest} from "@redux-saga/core/effects";
import { selectUnitsByIncident } from "../../selector";
import {
    ADD_LOG,
    CLEAR_INCIDENT, CLEAR_NAVIGATION,
    REMOVE_INCIDENT,
    REMOVE_INCIDENT_REQUESTED, SET_AVAILABLE_STATUS
} from "../../types";

function* handleRemoveIncident(action) {

    yield put({type: REMOVE_INCIDENT, id: action.id});
    yield put({type: ADD_LOG, log: `Remove incident ${action.id}`});

    const assignedUnits = yield select(selectUnitsByIncident(action.id));

    for (const unit of assignedUnits) {

        yield put({type: ADD_LOG, log: `Unit ${unit.id} become available`});

        yield put({type: CLEAR_INCIDENT, id: unit.id});
        yield put({type: CLEAR_NAVIGATION, id: unit.id});
        yield put({type: SET_AVAILABLE_STATUS, id: unit.id});
    }
}

export default function* () {
    yield takeLatest(REMOVE_INCIDENT_REQUESTED, handleRemoveIncident)
}