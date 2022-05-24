import React, {Component} from "react";

import Utils from '../../utils/Utils';

const utils = new Utils();

const space = {
    marginLeft: "8px"
}

export default function Agent(props){
    return  <div className="col-md-4 col-sm-4">
                <div className="laser-item shadow">
                    <div className="row">
                        <div className="col-md-7 col-sm-7">
                            <h4>{props.agent.firstname} {props.agent.lastname}</h4>
                            <h5>{utils.getDate(props.agent.created)}</h5>
                        </div>
                        <div className="col-md-5 col-sm-5">
                            <h5>{props.agent.phone_number}</h5>
                            <h4>{props.agent.department} department</h4>
                        </div>
                        <div className="col-md-offset-6 col-md-6 col-sm-offset-6 col-sm-6">
                            <button onClick={e => props.deleteClicked(e,props.agent)} className="laserbtn laser-red-bg laser-inline">delete</button>
                            <button style={space} onClick={e => props.editClicked(e,props.agent)} className="laserbtn laser-blue-bg laser-inline">edit</button>
                        </div>
                    </div>
                </div>
            </div>
} 