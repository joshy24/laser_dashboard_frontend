import React, {Component} from "react";

import Utils from '../../utils/Utils';

const utils = new Utils();

const space = {
    marginLeft: "8px"
}

export default function Admin(props){
    return  <div className="col-md-6 col-sm-6">
                <div className="laser-item shadow">
                    <div className="row">
                        <div className="col-md-7 col-sm-7">
                            <h5>Username</h5>
                            <h4>{props.admin.username}</h4>
                        </div>
                        <div className="col-md-5 col-sm-5">
                            <h5>Phone Number</h5>
                            <h5>{props.admin.phone_number}</h5>
                            <br/>
                            <h5>Priviledge</h5>
                            <h4>{props.admin.priviledge} priviledge</h4>
                        </div>
                        <div className="col-md-7 col-sm-7">
                            <h5>Full Name</h5>
                            <h4>{props.admin.firstname} {props.admin.lastname}</h4>
                            <br/>
                            <h5>Created</h5>
                            <h5>{utils.getDate(props.admin.created)}</h5>
                        </div>
                        <div className="col-md-5 col-sm-5">
                            <br/>
                            <br/>
                            <br/>
                            <button onClick={e => props.deleteClicked(e,props.admin)} className="laserbtn laser-red-bg laser-inline">delete</button>
                            <button style={space} onClick={e => props.editClicked(e,props.admin)} className="laserbtn laser-blue-bg laser-inline">edit</button>
                        </div>
                    </div>
                </div>
            </div>
} 