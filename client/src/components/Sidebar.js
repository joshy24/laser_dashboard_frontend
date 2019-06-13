'use strict'

import React, { Component } from 'react';

export default function Sidebar(props){
    return <div className="laser-side-bar">
                <h1 className="close_btn" onClick={e => props.closeSidebar(e)}>&#10005;</h1>
                <h4 className="text-center"><b>Emergency Location Details</b></h4> 
                <br/>
                <br/>
                <h5>Persons Name - {props.emergency.full_name}</h5>
                <br/>
                <h5>Email Address- {props.emergency.email ? props.emergency.email : ""}</h5>
                <br/>
                <h5>Phone Number - {props.emergency.phone_number ? props.emergency.phone_number : ""}</h5>
                <br/>
                <h5>Reason For Reachout - {props.emergency.reasons ? props.emergency.reasons[0] : ""}</h5>
           </div>
}