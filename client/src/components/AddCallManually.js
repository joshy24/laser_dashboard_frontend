import React from 'react';

import Utils from '../utils/Utils';

import AuthHelperMethods from '../auth/AuthHelperMethods';

const utils = new Utils();

const Auth = new AuthHelperMethods();

const controls_style = {
    marginLeft:"8px",
    marginRight: "8px"
}

export default function AddCallManually(props){
    return <div className="laser-side-bar">
                <h1 className="close_btn" onClick={e => props.closeSidebar(e)}>&#10005;</h1>
                <br/>
                <h4 className="text-center laser-blue-text"><b>Add Call Manually</b></h4> 
                <br/>
                <br/>
                <label className="laser-black-text" htmlFor="category"><h5>Full Name</h5></label>
                <input required autoComplete="off" id="manual_name" type="text" name="manual_name" onChange={props.onFieldChanged} value={props.manual_name} className="form-control bt-login-input" placeholder="Full Name"/>
                <label className="laser-black-text" htmlFor="category"><h5>Phone Number</h5></label>
                <input required autoComplete="off" id="manual_phone" type="text" name="manual_phone" onChange={props.onFieldChanged} value={props.manual_phone} className="form-control bt-login-input" placeholder="Phone Number"/>
                <label className="laser-black-text" htmlFor="category"><h5>Address</h5></label>
                <input required autoComplete="off" id="manual_address" type="text" name="manual_address" onChange={props.onFieldChanged} value={props.manual_address} className="form-control bt-login-input" placeholder="Address"/>
                <br/>
                <label className="laser-black-text" htmlFor="category"><h5>Reason For Call</h5></label>
                <select style={controls_style} className="form-control laser-inline laser-150-width" id="selected_manual_call" name="selected_manual_call" value={props.selected_manual_call} onChange={props.onManualCallChanged}>
                    <option>Emergency Management(LASEMA)</option>
                    <option>Police</option>
                    <option>Distress</option>
                    <option>Environmental and Special Offences Task Force</option>
                    <option>Fire / Safety Services</option>
                    <option>Environmental / Noise Pollution</option>
                    <option>Broken Pipe / Water Leakage</option>
                    <option>Pothole / Collapsed Road</option>
                    <option>Domestic / Sexual Violence</option>
                    <option>None</option>
                </select>
                <br/>
                <br/>
                <label className="laser-black-text" htmlFor="category"><h5>Caller Gender</h5></label>
                <select style={controls_style} className="form-control laser-inline laser-150-width" id="selected_manual_gender" name="selected_manual_gender" value={props.selected_manual_gender} onChange={props.onManualGenderChanged}>
                    <option>Male</option>
                    <option>Female</option>
                </select>        
                <br/>
                <br/>
                <button className="laser-blue-bg laserbtn" onClick={e => props.onSubmitManualCallDetails(e)}>Submit</button>
           </div>
}