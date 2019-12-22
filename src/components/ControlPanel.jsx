import React from 'react'
import {connect} from "react-redux";
import {CLEAR} from "../store/types";

function ControlPanel({clear, logs, height}) {

    return (
        <div
            style={{height: height + 15, width: 300, display: 'flex', flexDirection: 'column'}}>

            <div
                className='m-1 border rounded font-weight-light p-2 '
                style={{height: height, flex: 1, overflow: 'auto'}}>
                {
                    logs && logs.map(log => (
                        <React.Fragment>
                            <div style={{lineHeight: '100%'}}>
                                <small>{log}</small> <br/>
                            </div>
                            <div style={{lineHeight: '50%'}}>
                                <br/>
                            </div>
                        </React.Fragment>
                    ))
                }
            </div>

            <div>
                <button className='btn btn-outline-dark btn-sm m-1' onClick={clear}>Clear</button>
            </div>

        </div>
    );
}

const mapStateToProps = state => ({
    logs: state.logsReducer.logs
});

const mapDispatchToProps = dispatch => ({
    clear: () => dispatch({type: CLEAR}),
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
