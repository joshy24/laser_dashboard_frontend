
import React from 'react';

import Utils from '../utils/Utils';

import AuthHelperMethods from '../auth/AuthHelperMethods';

const utils = new Utils();

const Auth = new AuthHelperMethods();

export default function Sidebar(props){
    return <div className="laser-side-bar">
                <h1 className="close_btn" onClick={e => props.closeSidebar(e)}>&#10005;</h1>
                <br/>
                <h4 className="text-center laser-red-text"><b>Emergency Location Details</b></h4>
                <br/>
                {
                    (Auth.getPriviledge() === "full_control") ? 
                    <div>
                        <button className="laser-red-bg laserbtn" onClick={e => props.startMonitoring(e, props.emergency)}>Start Monitoring</button>
                        <br/>
                        <br/>                
                        <button className="laser-blue-bg laserbtn" onClick={e => props.resolve(e)}>Resolve</button>
                    </div> : ""
                }
                <br/>
                <h5><b>Trackable</b> - {props.emergency.is_trackable ? "Yes" : "No" }</h5>
                <br/>
                <h5><b>Time</b> - {utils.getTime(props.emergency.created)}</h5>
                <br/>
                <h5><b>Persons Name</b> - {props.emergency.full_name}</h5>
                <br/>
                <h5><b>Person's Emergency Contacts</b> - {(props.emergency.emergency_numbers && props.emergency.emergency_numbers.length>0) ? ParseContacts(props.emergency.emergency_numbers) : ""}</h5>
                <br/>
                <h5><b>Email Address</b> - {props.emergency.email ? props.emergency.email : ""}</h5>
                <br/>
                <h5><b>Phone Number</b> - {props.emergency.phone_number ? props.emergency.phone_number : ""}</h5>
                <br/>
                <h5><b>Device</b> - {props.emergency.device ? props.emergency.device : ""}</h5>
                <br/>
                <h5><b>Emergency Full Address</b> - {props.emergency.full_address ? props.emergency.full_address : ""}</h5>
                <br/>
                <h5><b>Emergency Admin Address</b> - {props.emergency.sub_admin_address ? props.emergency.sub_admin_address : ""}</h5>
                <br/>
                <h5><b>Reason For Emergency</b> - {props.emergency.reasons ? getReasons(props.emergency.reasons) : ""}</h5>
           </div>
}

function ParseContacts(arr){
    return arr.map((item,index) => {
        return <p key={index}>{item}</p>
    })
}

function getReasons(reasons){
    switch(reasons.length){
        case 0:
          return "";
        case 1:
          return reasons[0]+" emergency";
        case 2:
          return reasons[0] +" emergency, " +reasons[1] +" emergency";
        case 3:
          return reasons[0] +" emergency, " +reasons[1] +" emergency, " +reasons[2] +" emergency";
    }
}