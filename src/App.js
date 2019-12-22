import React ,{useState} from "react";
import SimulationStage from "./components/SimulationStage";
import store from './store/store';
import {Provider} from 'react-redux'
import ControlPanel from "./components/ControlPanel";
import Instructions from "./components/Instructions";

function App() {

    const [stageHeight, setStageHeight] = useState(800);

    return (
        <Provider store={store}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div
                    // className='border rounded p-3'
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
                    }}
                >
                    <Instructions/>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            // boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
                        }}
                    >
                        <ControlPanel height={stageHeight}/>
                        <SimulationStage liftUpStageHeight={setStageHeight}/>
                    </div>

                </div>
            </div>
        </Provider>
    );
}

export default App;