import React from 'react';

import Utils from '../utils/Utils';

import AuthHelperMethods from '../auth/AuthHelperMethods';

const utils = new Utils();

const Auth = new AuthHelperMethods();

export default function LocationSidebar(props){
    return <div className="laser-side-bar">
                <h1 className="close_btn" onClick={e => props.closeSidebar(e)}>&#10005;</h1>
                <br/>
                <h4 className="text-center laser-blue-text"><b>Call Location Details</b></h4> 
                <br/>
                {
                    (Auth.getPriviledge() === "full_control") ? 
                    <div>
                        <button className="laser-red-bg laserbtn" onClick={e => props.startMonitoring(e, props.location)}>Start Monitoring</button>
                        <br/>
                        <br/>                
                        <button className="laser-blue-bg laserbtn" onClick={e => props.resolve(e)}>Resolve</button>
                    </div> : ""
                }
                <br/>                
                <h5><b>Time</b> - {utils.getTime(props.location.created)}</h5>
                <br/>
                <h5><b>Persons Name</b> - {props.location.full_name}</h5>
                <br/>
                <h5><b>Email Address</b> - {props.location.email ? props.location.email : ""}</h5>
                <br/>
                <h5><b>Phone Number</b> - {props.location.phone_number ? props.location.phone_number : ""}</h5>
                <br/>
                <h5><b>Call Full Address</b> - {props.location.full_address ? props.location.full_address : ""}</h5>
                <br/>
                <h5><b>Call Admin Address</b> - {props.location.sub_admin_address ? props.location.sub_admin_address : ""}</h5>
                <br/>
                <h5><b>Reason For Call</b> - {props.location.reason ? props.location.reason : ""}</h5>
           </div>
}
