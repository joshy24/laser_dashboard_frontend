import React, {Component} from "react";

import Utils from '../../utils/Utils';

const utils = new Utils();

const marginLeft = {
    marginLeft: "16px"
}

export default function Department(props){
    return  <div className="col-md-4 col-sm-4">
                <div className="laser-item shadow">
                    <div className="row">
                        <div className="col-md-7 col-sm-7">
                            <h4 className="laser-black-text">{props.department.name}</h4>
                        </div>
                        <div className="col-md-5 col-sm-5">
                            <h5>{utils.getDate(props.department.created)}</h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-offset-6 col-md-6 col-sm-offset-6 col-sm-6">
                            <button onClick={e => props.deleteClicked(e, props.department)} className="laserbtn laser-red-bg laser-inline">delete</button>
                            <button style={marginLeft} onClick={e => props.editClicked(e, props.department)} className="laserbtn laser-blue-bg laser-inline">edit</button>
                        </div>
                    </div>
                </div>
            </div>
} 