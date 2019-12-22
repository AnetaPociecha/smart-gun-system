import {delay, put, takeLatest} from "@redux-saga/core/effects";
import {standardDelay} from "../../../utils/delay";
import {STEP} from "../../types";

function* handleStep() {

    yield delay(standardDelay);
    yield put({type: STEP});
}

export default function* watchStep() {
    yield takeLatest(STEP, handleStep)
}