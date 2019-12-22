import {copySupportUnits, Status} from "../store/reducer/supportUnit";
import grid from "./grid";
import {copyAllIncidents} from "../store/reducer/incident";

export default function (location) {
    return function (state) {
        let support = copySupportUnits(state.supportUnitsReducer.supportUnits);
        let incidents = copyAllIncidents(state.incidentsReducer.incidents);

        // 1
        const toBeRemovedIncidents = incidents.filter(incident => incident.supportUnits.length < 2);
        const unitsIds = toBeRemovedIncidents.map(incident => incident.supportUnits).flat();

        support = support.filter(unit => !unitsIds.includes(unit.id));
        incidents = incidents.filter(incident => incident.supportUnits.length > 1);

        // 3

        const noneUnitOnTheSpotIncidents = incidents.filter(incident => {
            const units = incident.supportUnits.map(id => support.find(unit => unit.id === id)).filter(unit => unit);
            return units.filter(unit => unit.status === Status.ON_THE_SPOT).length === 0
        });

        //const supportExtraCopy = copySupportUnits(support);

        for (const incident of noneUnitOnTheSpotIncidents) {
            const units = incident.supportUnits.map(id => support.find(unit => unit.id === id)).filter(item => item);

            let minNavLength = units[0].navigation.length;
            let closesUnit = units[0];

            for (const unit of units) {
                if (unit.navigation.length < minNavLength) {
                    minNavLength = unit.navigation.length;
                    closesUnit = unit;
                }
            }

            support = support.filter(unit => unit !== closesUnit);
        }

        // 2
        support = support.filter(unit => unit.status !== Status.ON_THE_SPOT);

        if (support.length === 0) return undefined;

        let minNavLength = grid.findPath(support[0].position, location);
        let closesUnit = support[0];

        for (const unit of support) {
            if (unit.navigation.length < minNavLength) {
                minNavLength = grid.findPath(unit.position, location);
                closesUnit = unit;
            }
        }

        return closesUnit;
    }
}
