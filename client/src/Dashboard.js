import React, {Component} from 'react';
import logo from './logo.svg';
import red_circle from './icons/emergency_with_circle.gif';
import blue_circle from './icons/call_with_circle.gif';
import emergency_icon from './icons/emergency.gif';
import call_icon from './icons/call.gif';
import car_test from './icons/car_test.png';

//import police_car from './icons/vector/police_car.svg'
//import police_car_enroute from './icons/vector/police_car_yellow.svg'

import police_car from './icons/PNG/police_car.png'
import police_car_using from './icons/PNG/police_car_using.png'
import police_car_using_other from './icons/PNG/police_car_other_using.png'
import police_car_in_focus from './icons/PNG/police_car_in_focus.png'

import fire_car from './icons/PNG/fire_truck.png'
import fire_car_using from './icons/PNG/fire_truck_using.png'
import fire_car_using_other from './icons/PNG/fire_truck_other_using.png'
import fire_car_in_focus from './icons/PNG/fire_truck_in_focus.png'

import ambulance from './icons/PNG/ambulance.png'
import ambulance_using from './icons/PNG/ambulance_using.png'
import ambulance_using_other from './icons/PNG/ambulance_other_using.png'
import ambulance_in_focus from './icons/PNG/ambulance_in_focus.png'

import alert from "./sounds/alert.mp3";
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';

import io from "socket.io-client";
import Sidebar from './components/Sidebar';
import Action from './components/Action';
import AgentDetails from './components/AgentDetails';
import LocationSidebar from './components/LocationSideBar';
import AddCallManually from './components/AddCallManually';
import ConfirmAddressNotFound from './components/ConfirmAddressNotFound';
import TopPanel from './components/TopPanel';
import Latest from './components/Latest';
import RouteStatus from './components/RouteStatus';
import ConfirmAction from './components/ConfirmAction';
import Utils from './utils/Utils';
import Persistence from './utils/Persistence';
import Sound from 'react-sound';

//Refactor 
import { usePubNub } from 'pubnub-react'

import Geocode from "react-geocode";

import Loader from './components/Loader';

import './App.css';

import * as API from './api/Api';

import AuthHelperMethods from './auth/AuthHelperMethods';

const utils = new Utils();
const persistence = new Persistence();

const mapStyle = {
    height: '100vh', 
    width: '100%'
}

//const socket_io_url = 'http://18.192.254.193';
const socket_io_url = 'http://localhost:3077';

let todays_date = new Date().toISOString();

let today = null;

let pubnub = null;

const Dashboard = ({logout}) => {
    pubnub = usePubNub();

    function showLoading(){
        setLoading(true)
    }
  
    function hideLoading(){
        setLoading(false)
    }
  
    function logout(){
        logout();
    }

    const showMonitoredEmergency = async(e) => {
        const emergency_full_row = await utils.getAdminEmergencyMonitored(browserAdmin._id, monitoring_grid);
        
        if(emergency_full_row && emergency_full_row.emergency){
            var item = emergency_full_row.emergency;
            
            switch(item.laser_type){
                case "emergency":
                    
                    break;
                case "call":
                    setState({
                      clicked_user: item,
                      side_bar_open: false,
                      location_side_bar_open: true,
                      agent_side_bar_open: false,
                      center: {
                        lat: item.latitude,
                        lng: item.longitude
                      },
                      zoom: 19,
                      show_red_circle: false,
                      show_blue_circle: true,
                      clicked_marker_id: item._id
                    })
                    break;
            }
        }
        else{
            setState({
                action: "message",
                action_message: "You are not monitoring any emergency or call at the moment",
            })
        }
    }

    return <div className="laser-parent-div" style={mapStyle}>
                <Latest latest={state.latest} latestClicked={latestClicked}/>
                {show_location_side_bar}
                {show_side_bar}
                {state.showConfirmManualLocation ? <ConfirmAddressNotFound closeConfirmAddressNotFoundClicked={continueConfirmAddressNotFoundClicked} tryAgainClicked={continueConfirmAddressNotFoundClicked} hideConfirmManualLocation={hideConfirmManualLocation} /> : ""}
                {state.manual_location_side_bar ? <AddCallManually onFieldChanged={onFieldChanged} closeSidebar={closeSideBar} selected_manual_call={state.selected_manual_call} selected_manual_gender={state.selected_manual_gender} manual_address={state.manual_address} manual_name={state.manual_name} onManualCallChanged={onManualCallChanged} onManualGenderChanged={onManualGenderChanged}  onSubmitManualCallDetails={onSubmitManualCallDetails}/> : "" }
                
                { 
                    state.agent_side_bar_open ? <AgentDetails removeAgentFromRoute={removeAgentFromRoute} closeAgentSideBar={closeAgentSideBar} addAgentToMonitoring={addAgentToMonitoring} agent={state.clicked_agent} user={state.clicked_user}/> : "" 
                }

                <TopPanel showMonitoredEmergency={showMonitoredEmergency} openManualLocation={openManualLocation} logout={logout} onCalendarOpen={onCalendarOpen} onDateChange={onDateChange} date={state.date} selected_call={state.selected_call} 
                onCallsChanged={onCallsChanged} selected_emergency={state.selected_emergency} onEmergenciesChanged={onEmergenciesChanged} getAgentsAroundEmergency={getAgentsAroundEmergency}/>

                <Map google={props.google} 
                    style={mapStyle}
                    onReady={fetchPlaces}
                    initialCenter={state.center}
                    center={state.center}
                    zoom={state.zoom}>
            
                    {getLocationsMarkers()}
                    {getEmergenciesMarkers()}
                    {getAgentMarkers()}

                </Map>
                
                <Loader isLoading={state.isLoading}/>

                <Action action={state.action} closeAction={closeAction} message={state.action_message}/>

                <Loader isLoading={state.isLoading}/>

                {sound}

                {
                    state.route_responses_from_agents.length > 0 ?  <RouteStatus route_response={state.route_responses_from_agents[state.route_responses_from_agents.length - 1]} removeAgentFromRouteAndCloseRouteResponse={removeAgentFromRouteAndCloseRouteResponse} closeRouteResponse={closeRouteResponse} /> : ""
                }

                {
                    state.showConfirm.status===true ? <ConfirmAction  yesClicked={state.showConfirm.action==="emergency" ? resolveEmergency : resolveCall} noClicked={hideConfirm} message={state.message} /> : ""
                }
    </div>
}

export default Dashboard;