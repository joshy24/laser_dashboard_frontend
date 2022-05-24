import React from "react"

import AuthHelperMethods from '../auth/AuthHelperMethods';

const Auth = new AuthHelperMethods();

const style = {
    background: "#2E86C1",
    border: "0px solid #000000",
    color: "#FFFFFF",
    padding: "8px",
    borderRadius: "4px"
}

const style_remove_btn = {
    background: "#000000",
    border: "0px solid #000000",
    color: "#FFFFFF",
    padding: "8px",
    borderRadius: "4px"
}

export default function AgentDetails(props){
    
    return <div className="laser-agent_side-bar">
                <h1 className="close_btn" onClick={e => props.closeAgentSideBar(e)}>&#10005;</h1>
                <br/>
                <h4 className="text-center laser-black-text"><b>Agents Details</b></h4>
                <br/>
                <h5><b>Agents Name</b> - {props.agent.agent.firstname} {props.agent.agent.lastname}</h5>
                <br/>
                <h5><b>Phone Number</b> - {props.agent.agent.phone_number}</h5>
                <br/>
                <h5><b>Agency</b> - {props.agent.agent.department}</h5>
                <br/>
                <h5><b>Current Location</b> - {props.agent.full_address}</h5>
                <br/>
                {
                    (Auth.getPriviledge() === "full_control") ? <div>
                                                                    <h5><b>Availability</b> - {props.agent.is_on_route ? props.agent.agent.firstname+" is currently monitoring an emergency"   : props.agent.agent.firstname+" is available"}</h5>
                                                                    <p>{props.agent.status === "using" ? <button style={style_remove_btn} onClick={e => props.removeAgentFromRoute(e, props.agent)} className="">Remove agent from route</button> : ""}</p>
                                                                    <br/>
                                                                    {props.user.full_name ?  <button style={style} onClick={e => props.addAgentToMonitoring(e, props.agent)} className="">Send Agent {props.agent.agent.firstname} {props.agent.agent.lastname} to {props.user.full_name}'s location </button> : ""}
                                                                </div> : ""
                }
           </div>

}