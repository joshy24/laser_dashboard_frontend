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
import { map } from 'bluebird';
import e from 'cors';

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


  //this is not showing the agents in the same lga
  const getAgentsAroundEmergency = () => {
    //show the agents around an emergency
    //search to see if an emergency is being monitored by the admin browser
    utils.checkIfEmergencyMonitoredByBrowserAdmin(browserAdmin._id, mapDetails.monitoring_grid)
                .then( async (boolean_value) => {
                    if(boolean_value){

                        //Refactor  ---------------------------------------------------------------------

                        //ideally this should be sent to those agents in the emergency's LGA
                        //for now we are publishing to all agents 
                     try{
                        await pubnub.publish(
                        {
                            message: {
                                pn_gcm: {
                                    data: {
                                        notification_body: "Tap to open the Laser App",
                                        data: {},
                                        action: "send_location"
                                    }
                                }
                            },
                            channel: mapDetails.tracked_area,
                            sendByPost: false, // true to send via POST
                            storeInHistory: false //override default storage     
                        })
                     }

                    catch(status){}

                        //Refactor End  ---------------------------------------------------------------------

                        utils.getAdminEmergencyMonitored(browserAdmin._id, mapDetails.monitoring_grid)
                                .then(emergency_monitored => {
                                    //admin is monitoring an emergency or call
                                    //check for the agents in emergency LGA
                                    utils.setAgentsInFocus(mapDetails.agents_in_focus, emergency_monitored.emergency, mapDetails.laser_agents)
                                        .then(result => {
                                            //we set the state for the laser agents and the agents in focus
                                            setMapDetails({...mapDetails, 
                                                laser_agents: result[0],
                                                agents_in_focus: result[1]
                                            })
                                        })
                                        .catch(err => {
                                            setMapDetails({
                                                ...mapDetails,
                                                action: "message",
                                                action_message: "An error occurred seeking agents around emergency"
                                            })
                                        })
                                })
                                .catch(err => {

                                })
                    }
                    else{
                        setMapDetails({
                            ...mapDetails,
                            action: "message",
                            action_message: "You are NOT monitoring any emergency or call"
                        })
                    }
                })
                .catch(err => {
                    setMapDetails({
                        ...mapDetails,
                        action: "message",
                        action_message: "An error occurred seeking agents around emergency"
                    })
                })
    }


    const latestClicked = (item) => {
        switch(item.laser_type){
            case "emergency":
                setMapDetails({
                    ...mapDetails, 
                    clicked_user: item,
                    side_bar_open: true,
                    location_side_bar_open: false,
                    agent_side_bar_open: false,
                    center: {
                      lat: item.latitude,
                      lng: item.longitude
                    },
                    zoom: 19,
                    show_red_circle: true,
                    show_blue_circle: false,
                    clicked_marker_id: item._id
                })
                break;
            case "call":
                setMapDetails({
                    ...mapDetails,
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


    const openManualLocation = () => {
        setMapDetails({
            ...mapDetails,
            manual_location_side_bar: true,
            side_bar_open: false,
            location_side_bar_open: false,
            agent_side_bar_open: false
        })
    }


    const onCalendarOpen = () => {
        setMapDetails({
            ...mapDetails,
            play_sound: false,
            side_bar_open: false, 
            location_side_bar_open: false,
            agent_side_bar_open: false
        })
    }

    const onDateChange = (date) => {

        //We add 1 hour to the date because the date axios is sending to the server is 1 hour behind what it should be
        date = new Date(date);
        date.setHours(date.getHours() + 1);
    
         setMapDetails({
            ...mapDetails,
            play_sound: false,
            date: date,
            show_red_circle: false,
            show_blue_circle: false,
            clicked_marker_id: "",
            action: "loading",
            action_message: "",
            selected_call:"Calls (All)", 
            selected_emergency:"Emergencies (All)"
         })
    
         getLocationsDate(date);
         getEmergenciesDate(date);
    }


    const onCallsChanged = (e) => {
        e.preventDefault();
        
        const target = e.target;
        const value = target.value;
        const name = target.name;
  
        let arr = [];
  
        if(state.locations.length>0){
            if(value==="Calls (All)"){
              setMapDetails({
                  ...mapDetails,
                  play_sound: false,
                  filtered_locations: state.locations,
                  side_bar_open: false, 
                  selected_call: value,
                  agent_side_bar_open: false,
                  location_side_bar_open: false,
                  show_blue_circle: false
              })
            }
            else if(value==="None"){
              setMapDetails({
                    ...mapDetails,
                    play_sound: false,
                    filtered_locations: [],
                    side_bar_open: false, 
                    selected_call: value,
                    agent_side_bar_open: false,
                    location_side_bar_open: false,
                    show_blue_circle: false
              })
            }
            else{
              mapDetails.locations.map(emer => {
                if(emer.reason.includes(value.toLowerCase())){
                  arr.push(emer)
                }
              })
              
              if(arr.length>0){
                setMapDetails({
                    ...mapDetails,
                    play_sound: false,
                    filtered_locations: arr,
                    selected_call: value,
                    side_bar_open: false, 
                    agent_side_bar_open: false,
                    location_side_bar_open: false,
                    show_blue_circle: false
                })
              }
              else{
                //show message that there are no locations found for that parameter
        
                setMapDetails({
                    ...mapDetails,
                    play_sound: false,
                    filtered_locations:[],
                    selected_call: value,
                    side_bar_open: false, 
                    location_side_bar_open: false,
                    show_blue_circle: false
                })
              }
            }
        }
        else{
            setMapDetails({
                ...mapDetails,
                selected_call: value
            })
        }
    }

    const onEmergenciesChanged = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        
        let arr = [];
        if(mapDetails.emergencies.length>0){
            if(value==="Emergencies (All)"){
              setMapDetails({
                    ...mapDetails,
                    play_sound: false,
                    filtered_emergencies: mapDetails.emergencies,
                    side_bar_open: false, 
                    selected_emergency: value,
                    location_side_bar_open: false,
                    agent_side_bar_open: false,
                    show_red_circle: false
              })
            }
            else if(value==="None"){
              setMapDetails({
                  ...mapDetails,
                  play_sound: false,
                  filtered_emergencies:[],
                  selected_emergency: value,
                  side_bar_open: false, 
                  agent_side_bar_open: false,
                  location_side_bar_open: false,
                  show_red_circle: false
              })
            }
            else{
              mapDetails.emergencies.map(emer => {
                if(emer.reasons&&emer.reasons.length>0){
                  emer.reasons.map(reason => {
                      if(value.toLowerCase().includes(reason)){
                          arr.push(emer)
                      }
                  })
                }
              })
        
              if(arr.length>0){
                    setMapDetails({
                        play_sound: false,
                        filtered_emergencies:arr,
                        selected_emergency: value,
                        side_bar_open: false, 
                        agent_side_bar_open: false,
                        location_side_bar_open: false,
                        show_red_circle: false
                    })
              }
              else{
                //show message that there are no emregencies found for that parameter
        
                setMapDetails({
                    ...mapDetails,
                    play_sound: false,
                    filtered_emergencies: [],
                    side_bar_open: false, 
                    selected_emergency: value,
                    agent_side_bar_open: false,
                    location_side_bar_open: false,
                    show_red_circle: false
                })
              }
            }
        }    
        else{
            setMapDetails({
                ...mapDetails, 
                selected_emergency: value
            })
        }
    }

    const onCallClicked = (location,e) => {
            setMapDetails({
                play_sound: false,
                clicked_user: location,
                clicked_agent: {},
                side_bar_open: false,
                agent_side_bar_open: false,
                manual_location_side_bar: false,
                location_side_bar_open: true,
                center: {
                  lat: location.latitude,
                  lng: location.longitude
                },
                zoom: 19,
                show_red_circle: false,
                show_blue_circle: true,
                clicked_marker_id: location._id
            })
    }

    const onEmergencyClicked = (emergency,e) => {
        e.preventDefault()

        setMapDetails({
            play_sound: false,
            clicked_user: emergency,
            clicked_agent: {},
            side_bar_open: true,
            manual_location_side_bar: false,
            agent_side_bar_open: false,
            location_side_bar_open: false,
            center: {
                lat: emergency.latitude,
                lng: emergency.longitude
            },
            zoom: 19,
            show_red_circle: true,
            show_blue_circle: false,
            clicked_marker_id: emergency._id
        })
    }
    
    const onAgentClicked = (agent,e) => {
        setMapDetails({
            ...mapDetails,
            play_sound: false,
            clicked_agent: agent,
            manual_location_side_bar: false,
            agent_side_bar_open: true
        })
    }

    const getLocationsMarkers = () => {
        let locations_ui;

        if(mapDetails.filtered_locations.length>0){
            locations_ui = mapDetails.filtered_locations.map(loc => {
                return  <Marker key={loc._id} onClick={e => onCallClicked(loc,e)}
                            name={loc.reason} 
                            title={loc.full_name}
                            position={{lat: loc.latitude, lng: loc.longitude}}
                            icon={{
                                url: (state.clicked_marker_id===loc._id) ? blue_circle : call_icon
                            }}/> 
            })
        }
        else{
            locations_ui = "";
        }
        
        return locations_ui;
    }


    const getEmergenciesMarkers = () => {
        let emergencies_ui;
  
        if(mapDetails.filtered_emergencies.length>0){
            emergencies_ui = mapDetails.filtered_emergencies.map(emer => {
              
              return <Marker key={emer._id} onClick={e => onEmergencyClicked(emer,e)}
                        name={emer.reasons[0]} 
                        title={emer.full_name}
                        position={{lat: emer.latitude, lng: emer.longitude}}
                        icon={{
                          url: (mapDetails.clicked_marker_id===emer._id) ? red_circle : emergency_icon
                        }}/>
            })
        }
        else{
            emergencies_ui = "";
        }
        
        return emergencies_ui;
    }


    const getAgentMarkers = () => {
        let agents_ui;
  
        if(mapDetails.laser_agents.length>0){
              agents_ui = mapDetails.laser_agents.map((agent,i) => {
                  
                  return <Marker key={i}  onClick={e => onAgentClicked(agent,e)}
                              name={agent.full_address} 
                              title={agent.full_address}
                              position={{lat: agent.latitude, lng: agent.longitude}}
                              //
                              icon={{
                                  url: getAgentIcon(agent),
                                  anchor: new google.maps.Point(40,40),
                                  scaledSize: new google.maps.Size(40,40)
                              }}/>
              })
        }
        else{
              agents_ui = "";
        }
  
        return agents_ui;
    }

    const getAgentIcon = (agent) => {

        if(agent){
              //we got the icon
              switch(agent.agent.department){
                  case "police":
                      switch(agent.status){
                          case "idle":
                              return police_car;
                          break;
                          case "infocus":
                              return police_car_in_focus;
                          break;
                          case "using":
                              return police_car_using;
                          break;
                          case "using_by_other":
                              return police_car_using_other;
                          break;
                      }
                  break;
                  case "fire":
                      switch(agent.status){
                          case "idle":
                              return fire_car;
                          break;
                          case "infocus":
                              return fire_car_in_focus;
                          break;
                          case "using":
                              return fire_car_using;
                          break;
                          case "using_by_other":
                              return fire_car_using_other;
                          break;
                      }
                  break;
                  case "hospital":
                      switch(agent.status){
                          case "idle":
                              return ambulance;
                          break;
                          case "infocus":
                              return ambulance_in_focus;
                          break;
                          case "using":
                              return ambulance_using;
                          break;
                          case "using_by_other":
                              return ambulance_using_other;
                          break;
                      }
                  break;
              }
        }
    }


  const getEmergencies = () => {
    const response = await API.getEmergencies({date: today})

    if(response=="error"){
        //show error message
        setMapDetails({
            ...mapDetails,
            action: "err_emergency_load",
            emergencies: [],
            filtered_emergencies: []
        })
        return;
    }

    if(response&&response.data&&response.data.emergencies&&response.data.emergencies.length>0){
        var loc = state.latest;

        for(var i = 0; i<response.data.emergencies.length; i++){
            loc.push(response.data.emergencies[i]);
        }

        loc = utils.sortDates(loc);

        if(mapDetails.action === "loading"){
            setMapDetails({
                ...mapDetails,
                action: "close",
                latest : loc,
                emergencies: response.data.emergencies,
                filtered_emergencies: response.data.emergencies
            })
        }
        else{
            setMapDetails({
                ...mapDetails,
                latest : loc,
                emergencies: response.data.emergencies,
                filtered_emergencies: response.data.emergencies
            })
        }
    }
    else{
        setMapDetails({
            ...mapDetails,
            action: "close",
            emergencies: [],
            filtered_emergencies: []
        })
    }
}



const getLocations = () => {

    const response = await API.getLocations({date: today})

    if(response=="error"){
        //show error message
        setMapDetails({
            ...mapDetails,
            action: "err_calls_load",
            locations: [],
            filtered_locations: []
        })
        return;
    }

    if(response&&response.data&&response.data.locations&&response.data.locations.length>0){

        var loc = state.latest;

        for(var i = 0; i<response.data.locations.length; i++){
            loc.push(response.data.locations[i]);
        }

        loc = utils.sortDates(loc);

        if(mapDetails.action === "loading"){
            setMapDetails({
                ...mapDetails,
                action: "close",
                latest : loc,
                locations: response.data.locations,
                filtered_locations: response.data.locations
            })
        }
        else{
            setMapDetails({
                ...mapDetails,
                latest : loc,
                locations: response.data.locations,
                filtered_locations: response.data.locations
            })
        } 
    }
    else{
        setMapDetails({
            ...mapDetails,
            action: "close",
            locations: [],
            filtered_locations: []
        })
    }
}


const handleSongFinishedPlaying = () => {
    setMapDetails({
        ...mapDetails,
        play_sound: false
    })
}

const onFieldChanged = (e) => {
  const target = e.target;
  const value = target.type === 'checkbox' ? target.checked : target.value;
  const name = target.name;

  setMapDetails({...mapDetails, [name]: value})
}

const onManualCallChanged = (e) => {
  const target = e.target;
  const value = target.value;

  setMapDetails({
      ...mapDetails,
      selected_manual_call: value
  })
}

const onManualGenderChanged = (e) => {
  const target = e.target;
  const value = target.value;

  setMapDetails({
      ...mapDetails,
      selected_manual_gender: value
  })
}

const onSubmitManualCallDetails = (e) => {
    e.preventDefault();

    if(mapDetails.selected_manual_call.length <= 0){
        setMapDetails({
            ...mapDetails,
            action: "message",
            action_message: "Please enter a valid reason for call from the drop down"
        })
        return;
    }

    if(mapDetails.manual_phone.lenght <= 0){
        setMapDetails({
            ...mapDetails,
            action: "message",
            action_message: "Please enter a valid phone number"
        })
        return;
    }

    if(mapDetails.selected_manual_gender.length <= 0){
        setMapDetails({
            ...mapDetails,
            action: "message",
            action_message: "Please enter a valid gender"
        })
        return;
    }

    if(mapDetails.manual_name.length <= 0){
        setMapDetails({
            ...mapDetails,
            action: "message",
            action_message: "Please enter a valid name"
        })
        return;
    }

    if(mapDetails.manual_address.length <= 0){
        setMapDetails({
            ...mapDetails,
            action: "message",
            action_message: "Please enter an address"
        })
        return;
    }

    //show loading
    //translate address to longitude and latitude
    setMapDetails({
        ...mapDetails,
        action: "loading",
        action_message: ""
    })

    Geocode.fromAddress(mapDetails.manual_address).then(
          response => {
                const { lat, lng } = response.results[0].geometry.location;

                var location = {
                    action: mapDetails.selected_manual_call,
                    longitude: lng,
                    latitude: lat,
                    full_address: mapDetails.manual_address,
                    full_name: mapDetails.manual_name,
                    phone_number: mapDetails.manual_phone
                }

                saveManualLocation(location);

          },
          error => {
          console.error(error);

          setMapDetails({
              ...mapDetails,
              action: "message",
              action_message: "We could not find that address",
              showConfirmManualLocation: true
          })
          }
    );
}

const showConfirmManualLocation = () => {
    setMapDetails({...mapDetails,showConfirmManualLocation: true})
}

const hideConfirmManualLocation = () => {
    setMapDetails({
        ...mapDetails,
        showConfirmManualLocation: false
    })
}

const tryAgainClicked = () => {
    this.hideConfirmManualLocation();

    setMapDetails({
        ...mapDetails,
        action: "loading",
        action_message: ""
    })

    Geocode.fromAddress(mapDetails.manual_address).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;

        var location = {
              action: mapDetails.selected_manual_call,
              longitude: lng,
              latitude: lat,
              full_address: mapDetails.manual_address,
              full_name: mapDetails.manual_name,
              phone_number: mapDetails.manual_phone
        }

        this.saveManualLocation(location);
      },
      error => {

        setMapDetails({
            ...mapDetails,
            action: "message",
            action_message: "We could not find that address"
        })
      }
    );
}


const continueConfirmAddressNotFoundClicked = () => {
      this.hideConfirmManualLocation();
      /*

      this.setState({
          action: "loading",
          action_message: ""
      });

      var location = {
          action: mapDetails.selected_manual_call,
          longitude: lng,
          latitude: lat,
          full_address: mapDetails.manual_address,
          full_name: mapDetails.manual_name,
          phone_number: mapDetails.manual_phone
      }

      this.saveManualLocation(location);*/
}

const closeConfirmAddressNotFoundClicked = () => {
  setMapDetails({
      ...mapDetails,
      action: "message",
      action_message: ""
  })
  this.hideConfirmManualLocation();
}

const saveManualLocation = (location) => {
      const response = await API.createManualLocation(location)
      
      if(response=="error"){
          //show error message
          setMapDetails({
              ...mapDetails,
              action: "message",
              action_message: "An error occurred saving the location. Please try again"
          })

          return;
      }
      
      if(response&&response.data){
          if(response.data.response==="out_of_lagos"){
              setMapDetails({
                  ...mapDetails,
                  action: "message",
                  action_message: "That location is outside Lagos State"
              })
              return;
          }

          setMapDetails({
              ...mapDetails,
              action: "message",
              action_message: "The location has been saved and is displayed on the map",
              selected_manual_call:"Emergency Management(LASEMA)",
              selected_manual_gender:"Male",
              manual_name: "",
              manual_phone: "",
              manual_address: "",
              manual_location_side_bar: false
          })

          /*this.setState(state => {
              let arr = state.locations;
              let lat = state.latest;
              
              lat.push(response.data.response);
              arr.push(response.data.response)

              return {
                  play_sound: true,
                  latest: lat,
                  clicked_marker_id: response.data.response._id,
                  zoom: 18,
                  locations: arr,
                  center: {
                      lat: response.data.response.latitude,
                      lng: response.data.response.longitude
                  }
              }
          })*/
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