import {delay, put, select, takeEvery} from "@redux-saga/core/effects";
import grid from "../../../utils/grid";
import {selectUnitById} from "../../selector";
import {
    ADD_LOG,
    ADD_SUPPORT_UNIT,
    SET_AVAILABLE_STATUS, SET_INCIDENT, SET_NAVIGATION, SET_STATUS
} from "../../types";
import {Status} from "../../reducer/supportUnit";
import selectNewTarget from "../../../utils/selectNewTarget";

function* handleSetAvailableStatus(action) {

    // select oldest or oldest unhandled and assign

    const incident = yield select(selectNewTarget);
    yield put({type: ADD_LOG, log: `Search for new target for unit ${action.id}`});

    if (incident) {
        const unit = yield select(selectUnitById(action.id));
        const navigation = grid.findPath(unit.position, incident.location);

        yield put({type: SET_NAVIGATION, id: unit.id, navigation});
        yield put({type: SET_STATUS, status: Status.ON_ITS_WAY, id: unit.id});
        yield put({type: SET_INCIDENT, incident: incident.id, id: unit.id});

        yield put({type: ADD_SUPPORT_UNIT, id: incident.id, supportUnit: unit.id});

        yield put({type: ADD_LOG, log: `Assign unit ${unit.id} to incident ${incident.id}`});

    } else {
        yield delay(1000);
        const unit = yield select(selectUnitById(action.id));
        if(unit.status === Status.AVAILABLE) {
            const incident = yield select(selectNewTarget);
            if(incident) {
                const navigation = grid.findPath(unit.position, incident.location);

                yield put({type: SET_NAVIGATION, id: unit.id, navigation});
                yield put({type: SET_STATUS, status: Status.ON_ITS_WAY, id: unit.id});
                yield put({type: SET_INCIDENT, incident: incident.id, id: unit.id});

                yield put({type: ADD_SUPPORT_UNIT, id: incident.id, supportUnit: unit.id});

                yield put({type: ADD_LOG, log: `Assign unit ${unit.id} to incident ${incident.id}`});
            }
        }
    }
}

export default function* () {
    yield takeEvery(SET_AVAILABLE_STATUS, handleSetAvailableStatus)
}