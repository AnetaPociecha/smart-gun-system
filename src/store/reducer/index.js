import { combineReducers } from 'redux'
import incidentsReducer from './incident'
import supportUnitsReducer from './supportUnit'
import logsReducer from './logs'
import simulationReducer from './simulation'

export default combineReducers({
    incidentsReducer, supportUnitsReducer, logsReducer, simulationReducer
})