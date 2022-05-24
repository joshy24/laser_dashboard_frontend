import React, {Component} from 'react';

import DatePicker from 'react-date-picker';

import burger_menu from "../icons/burger_menu.png";
import phone_white from '../icons/phone_white.png';

import manual_call from '../icons/manual_call.png'
import locate_agents from '../icons/locate_agents.png'
import emergency_monitored from '../icons/emergency_monitored.png'
import logout from '../icons/logout.png'

import AuthHelperMethods from '../auth/AuthHelperMethods';

const Auth = new AuthHelperMethods();

const dateStyle = {
    color: "#111111",
    border: "0px solid #FFFFFF",
    zIndex: "6000",
    marginLeft:"8px",
    marginRight: "8px",
    padding: "8px"
}

const controls_style = {
    marginLeft:"8px",
    marginRight: "8px"
}

export default class TopPanel extends Component{
    
    render(){
        return (
            <div className="laser-top-panel">
                
                <h4 className="laser-inline laser-header-text"> Laser Emergency Admin - Monitoring and Dispatch</h4>
                
                <div className="laser-controls">
                    {
                        (Auth.getPriviledge() === "full_control") ? <button onClick={e => this.props.openManualLocation(e)} className="laser-inline laserbtn laser-transparent-btn laser-white-bg"><img src={manual_call} width="35" height="35"/></button> : ""
                    }
                    {
                        (Auth.getPriviledge() === "full_control") ? <button onClick={e => this.props.showMonitoredEmergency(e)} className="laser-inline laser-transparent-btn laserbtn laser-white-bg"><img src={emergency_monitored} width="35" height="35"/></button> : ""
                    }
                    {
                        (Auth.getPriviledge() === "full_control") ? <button onClick={e => this.props.getAgentsAroundEmergency(e)} className="laser-inline laser-transparent-btn laserbtn laser-white-bg"><img src={locate_agents} width="35" height="35"/></button> : ""
                    }
                    
                    <div className="laser-inline" style={dateStyle}>
                        <DatePicker
                            onCalendarOpen={this.props.onCalendarOpen}
                            maxDate={new Date()}
                            style={dateStyle}
                            onChange={this.props.onDateChange}
                            value={this.props.date}/>
                    </div>  

                    <select style={controls_style} className="form-control laser-inline laser-150-width" id="calls" name="calls" value={this.props.selected_call} onChange={this.props.onCallsChanged}>
                        <option>Calls (All)</option>
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
                    
                    <select style={controls_style} className="form-control laser-inline laser-150-width" id="emergencies" name="emergencies" value={this.props.selected_emergency} onChange={this.props.onEmergenciesChanged}>
                        <option>Emergencies (All)</option>
                        <option>Police Cases</option>
                        <option>Hospital Cases</option>
                        <option>Fire Cases</option>
                        <option>None</option>
                    </select>

                    <button onClick={e => this.props.logout(e)} className="laser-inline laser-transparent-bg laserbtn laser-white-bg"><img src={logout} width="35" height="35"/></button>
                    
                </div>
            </div>
        )
    }
} 