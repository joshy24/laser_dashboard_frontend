

import React, {useState} from 'react';
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

function Dashboard(){

    pubnub = usePubNub();

    const [mapDetails, setMapDetails] = useState({
        showConfirm: {
            action: "",
            status: false
        },
        latest: [],
        locations: [], 
        emergencies: [], 
        filtered_locations: [],
        filtered_emergencies: [],
        side_bar_open: false, 
        agent_side_bar_open: false, 
        location_side_bar_open: false, 
        manual_location_side_bar: false,
        clicked_user: {}, 
        clicked_agent: {},
        center: {lat: 6.5244,lng: 3.3792}, 
        selected_call:"Calls (All)", 
        selected_emergency:"Emergencies (All)",
        zoom : 11,
        show_red_circle: false,
        show_blue_circle: false,
        clicked_marker_id: "",
        play_sound: false,
        channels_list: ["lllaser"],

        agents_in_focus: [],
        laser_agents:[], //all agents
        monitoring_grid: [],
        responses_available: false,

        route_responses_from_agents: [],
        action: "loading",
        action_message: "",
        tracked_area: "lllaser", //the user in which the admin is currently viewing whether the user wants to be tracked or not
        date: new Date(),
        message: "",

        selected_manual_call:"Emergency Management(LASEMA)",
        selected_manual_gender:"Male",
        manual_name: "",
        manual_phone: "",
        manual_address: "",
        showConfirmManualLocation: false,

        isLoading: false
    })

   
    return <div>


    </div>

}

export default Dashboard;