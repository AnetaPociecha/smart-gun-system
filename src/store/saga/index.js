import {fork, all} from 'redux-saga/effects'
import watchAddIncident from './addIncident'
import watchRemoveIncident from './removeIncident'
import watchSimulationStep from './simulationStep'
import watchSetAvailableStatus from './availableUnit'

export default function* () {
    yield all([
        fork(watchAddIncident),
        fork(watchRemoveIncident),
        fork(watchSimulationStep),
        fork(watchSetAvailableStatus)
    ])
}