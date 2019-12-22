import React, {useEffect, useState} from 'react'
import {Circle, Layer, Rect, Stage, Label, Text} from "react-konva";
import {connect} from "react-redux";
import grid from "../utils/grid";
import {CREATE_INCIDENT_REQUESTED, REMOVE_INCIDENT_REQUESTED, STEP} from "../store/types";

function SimulationStage({incidents, simulate, addIncident, removeIncident, supportUnits, liftUpStageHeight}) {

    useEffect(() => {
        simulate();
    }, [simulate]);

    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setHeight(window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    });

    const stagePadding = 10;
    const baseHeight = (height - stagePadding * 2 - 100);
    const minHeight = 300;
    const newStageHeight = baseHeight > minHeight ? baseHeight : minHeight;
    const scale = newStageHeight / grid.height;

    liftUpStageHeight(newStageHeight);

    return (
        <div
            style={{height: grid.height * scale + stagePadding * 2}}
        >

            <Stage width={grid.width * scale + stagePadding * 2} height={grid.height * scale + stagePadding * 2}>
                <Layer>

                    {grid.buildings.map(building => (
                        <Rect
                            key={`b${building.x}${building.y}`}
                            x={building.x * scale + stagePadding}
                            y={building.y * scale + stagePadding}
                            width={grid.buildingSize * scale}
                            height={grid.buildingSize * scale}
                            fill='#d9d9d9'
                            opacity={0.8}
                            shadowColor="black"
                            shadowBlur={10}
                            shadowOpacity={0.6}
                        />
                    ))}

                    {grid.cells.map(cell => (
                        <Rect
                            key={`c${cell.x}${cell.y}${grid.cells.indexOf(cell)}`}
                            x={cell.x * scale + stagePadding}
                            y={cell.y * scale + stagePadding}
                            width={grid.roadSize * scale}
                            height={grid.roadSize * scale}
                            onClick={() => addIncident(cell)}
                        />
                    ))}

                    {supportUnits && supportUnits.map(unit => (
                        <React.Fragment key={`${unit.id}`}>
                            <Circle

                                x={unit.position.x * scale + grid.roadSize * scale / 2 + stagePadding}
                                y={unit.position.y * scale + grid.roadSize * scale / 2 + stagePadding}
                                radius={grid.roadSize * scale / 2 - 1}
                                fill='blue'
                                opacity={0.8}
                                shadowColor="black"
                                shadowBlur={5}
                                shadowOpacity={0.6}
                            />
                            <Label
                                x={unit.position.x * scale + grid.roadSize * scale / 2 + stagePadding}
                                y={unit.position.y * scale + grid.roadSize * scale / 2 + stagePadding}
                            >
                                <Text
                                    fontWeight="bold"
                                    shadowBlur={5}
                                    fill='white'
                                    text={`${unit.id}`}/>
                            </Label>
                        </React.Fragment>
                    ))}

                    {incidents && incidents.map(incident => (
                        <React.Fragment key={`${incident.id}`}>
                            <Circle
                                x={incident.location.x * scale + grid.roadSize * scale / 2 + stagePadding}
                                y={incident.location.y * scale + grid.roadSize * scale / 2 + stagePadding}
                                radius={grid.roadSize * scale / 2 - 1}
                                fill='red'
                                opacity={0.8}
                                shadowColor="black"
                                shadowBlur={5}
                                shadowOpacity={0.6}
                                onClick={() => removeIncident(incident.id)}
                            />
                            <Label
                                x={incident.location.x * scale + grid.roadSize * scale / 2 + stagePadding}
                                y={incident.location.y * scale + grid.roadSize * scale / 2 + stagePadding}
                                onClick={() => removeIncident(incident.id)}
                            >
                                <Text
                                    fontWeight="bold"
                                    shadowBlur={5}
                                    fill='white'
                                    text={`${incident.id}`}/>
                            </Label>
                        </React.Fragment>
                    ))}

                </Layer>
            </Stage>
        </div>
    );
}

const mapStateToProps = state => ({
    supportUnits: state.supportUnitsReducer.supportUnits,
    incidents: state.incidentsReducer.incidents,
});

const mapDispatchToProps = dispatch => ({
    simulate: () => dispatch({type: STEP}),
    addIncident: (location) => dispatch({type: CREATE_INCIDENT_REQUESTED, location}),
    removeIncident: (id) => dispatch({type: REMOVE_INCIDENT_REQUESTED, id}),
});

export default connect(mapStateToProps, mapDispatchToProps)(SimulationStage);
