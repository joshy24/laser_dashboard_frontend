import React, {useEffect, useState} from 'react';
import red_circle from './icons/emergency_with_circle.gif';
import blue_circle from './icons/call_with_circle.gif';
import emergency_icon from './icons/emergency.gif';
import call_icon from './icons/call.gif';
import car_test from './icons/car_test.png';
import './App.css'; 

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

const Auth = new AuthHelperMethods();

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

let browserAdmin = null;

const Dashboard = ({logout, google}) => {
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

    useEffect(() => {

        pubnub.unsubscribe({
            channels:   mapDetails.channels_list
        });

    }, [])

    useEffect(() => {
        browserAdmin = Auth.getAdmin();

        //Refactor  ---------------------------------------------------------------------

        //subscribe to the parent channel to receive location updates from agents
        pubnub.subscribe({
            channels:   mapDetails.channels_list
        })

        //Refactor End  ---------------------------------------------------------------------

        setMapDetails({...mapDetails,
            laser_agents: []
        })

        getMonitoringGridFromServerAndReconcileAssignedAgents();

        var responses = persistence.getCompletedEmergenciesResponse();

        if(responses && responses.length > 0){
            setMapDetails({...mapDetails,
                route_responses_from_agents: responses
            })
        }

        //Refactor  ---------------------------------------------------------------------

        pubnub.addListener({
        status: (st) => {
                if(st.category === "PNNetworkUpCategory"){
                    setMapDetails({...mapDetails,
                        action: "message",
                        action_message: "You are back online."
                    })
                    getMonitoringGridFromServerAndReconcileAssignedAgents();
                }

                if(st.category === "PNConnectedCategory"){
                    //intentionally left blank
                }

                if (st.category === "PNReconnectedCategory") {
                    setMapDetails({...mapDetails,
                        action: "message",
                        action_message: "You are back online."
                    })
                    getMonitoringGridFromServerAndReconcileAssignedAgents();
                }

                if (st.category === "PNNetworkIssuesCategory") {
                    setMapDetails({...mapDetails,
                        action: "message",
                        action_message: "It appears there is a network issue."
                    })
                }

                if (st.category === "PNNetworkDownCategory") {
                    setMapDetails({...mapDetails,
                        action: "message",
                        action_message: "It appears the network is down."
                    })
                }

                if (st.category === "PNTimeoutCategory") {
                    setMapDetails({...mapDetails,
                        action: "message",
                        action_message: "Could not connect to the internet."
                    })
                }
        },
        message: (message) => {

            /*var tracked_user_id =   mapDetails.tracked_users.find(id => id === message.channel);

            if(tracked_user_id){
                    //the message is from a user currently being monitored
                    if(message.userMetadata && message.userMetadata.action === "user_location_update"){
                        var arr =   mapDetails.emergencies.map(emergency => {
                            if(emergency.user === tracked_user_id){
                                emergency.latitude = message.message.latitude;
                                emergency.longitude = message.message.longitude;
                                return emergency;
                            }
                            else{
                                return emergency;
                            }
                        })

                        //var found_emergency =   mapDetails.emergencies.find(emergency => emergency.user ===   mapDetails.tracked_user_id);

                        (state => {
                            return{
                                emergencies: arr
                            }
                        })
                    }
            }*/

            utils.getAdminEmergencyMonitored(browserAdmin._id,   mapDetails.monitoring_grid)
                            .then(emergency_full_row => {
                                var emergency_monitored = emergency_full_row.emergency;

                                if(message.channel === emergency_monitored._id ){
                                    if(message.userMetadata && message.userMetadata.action === "user_location_update"){
                                        
                                        var arr =   mapDetails.emergencies.map(emergency => {
                                            if(emergency.user === emergency_monitored.user){
                                                emergency.latitude = message.message.latitude;
                                                emergency.longitude = message.message.longitude;
                                                return emergency;
                                            }
                                            else{
                                                return emergency;
                                            }
                                        })
                    
                                        //var found_emergency =   mapDetails.emergencies.find(emergency => emergency.user ===   mapDetails.tracked_user_id);
                    
                                    setMapDetails({
                                        ...mapDetails,
                                        emergencies: arr
                                    })
                                    }
                                }
                            })
                            .catch(err => {

                            })
            
            //if(message.channel ===   mapDetails.tracked_area ){
                
                if(message.userMetadata && message.userMetadata.action === "agent_location_update"){
                    try{
                        console.log(message.message.agent)
                    }
                    catch(err){

                    }
                    utils.updateAgentLocation(message.message,   mapDetails.laser_agents,   mapDetails.monitoring_grid, browserAdmin._id)
                                .then(sorted_agents => {
                                    setMapDetails({
                                        ...mapDetails,
                                            laser_agents: sorted_agents
                                        
                                    })
                                }) 
                                .catch(err => {
                                    console.log(err)
                                })
                }
            //}

            //we check the response of an agent that has been assigned, whether the agent sent a message to decilne
            if(message.userMetadata && message.userMetadata.action === "route_request_response"){
                    //we check which agent is responding to the emergency request
                    var emergency_agent = message.message;

                    if(message.channel === emergency_agent._id ){
                        showLoading();

                        var assigned_agents = persistence.getAssignedAgents();

                        //we get the agent full profile from the persisted listof assigned agents
                        utils.getAgentFromAssignedAgentsInPersistence(assigned_agents, emergency_agent._id)
                                    .then(agent_found =>{
                                        //we proceed to remove the agent from the emergency and update the monitoring grid and all other parts of the system
                                        removeAgentFromEmergencyAfterDecliningRequest(agent_found);
                                    })
                                    .catch(err => {
                                    
                                        setMapDetails({
                                            ...mapDetails,
                                            action: "message",
                                            action_message: "Agent " +emergency_agent.firstname +" declined to attend to emergency but an error occurred updating the system. Please manually remove the agent from emergency"
                                        })
                                    })
                    }
            }

            if(message.userMetadata && message.userMetadata.action === "route_completed"){
                    //show message that agent has completed route

                    var responses = persistence.getCompletedEmergenciesResponse();

                    utils.getAdminEmergencyMonitored(browserAdmin._id,   mapDetails.monitoring_grid)
                            .then(emergency_monitored => {

                                var assigned_agents = persistence.getAssignedAgents();

                                //we get the agent full profile from the persisted listof assigned agents
                                utils.getAgentFromAssignedAgentsInPersistence(assigned_agents, message.message._id)
                                            .then(agent_found =>{
                                                if(responses && responses.length > 0){
                                                    responses.push({agent:agent_found, user: emergency_monitored.emergency});
                                                }
                                                else{
                                                    responses = [{agent:agent_found, user: emergency_monitored.emergency}];
                                                }
                                
                                                persistence.saveCompletedEmergenciesResponse(responses);
                                
                                                setMapDetails({
                                                    ...mapDetails,
                                                    route_responses_from_agents: responses
                                                })
                                            })
                                            .catch(err => {
                                                
                                            })

                            })
                            .catch(err => {
                                
                            })
            } 
            
        }
        });

        //Refactor End  ---------------------------------------------------------------------

        /*const socket = socketIOClient(socket_io_url, {
            //withCredentials: true
        });*/

        const socket = io(socket_io_url)

        socket.on("connect", 
        () => console.log("connected to socket io")
        );

        socket.on("reconnect", attempt => {
            console.log("Socket IO Reconnected")
            //successfully reconnected
            //get the lastest data
        })

        //Listen for data on the "outgoing data" namespace and supply a callback for what to do when we get one. In this case, we set a state variable
        socket.on("emergency", 
        
        data => {
            if(data){
                
                let arr =   mapDetails.emergencies;
                let lat =   mapDetails.latest;
                
                lat.push(data);
                arr.push(data) 

                setMapDetails({
                    ...mapDetails,
                    play_sound: true,
                    latest: lat,
                    clicked_marker_id: data._id,
                    zoom: 18,
                    emergencies: arr,
                    center: {
                        lat: data.latitude,
                        lng: data.longitude
                    }
                })
            }
        }
        );

        socket.on("call", 
        data => {
            if(data){
                let arr =   mapDetails.locations;
                let lat =   mapDetails.latest;
                
                lat.push(data);
                arr.push(data)
                
                setMapDetails({
                    ...mapDetails,
                    play_sound: true,
                    latest: lat,
                    clicked_marker_id: data._id,
                    zoom: 18,
                    locations: arr,
                    center: {
                    lat: data.latitude,
                    lng: data.longitude
                    }
                })
            }
        }
        );

        socket.on("monitoring_update", (id) => {
            if(id !== browserAdmin._id){
                //pull the monitoring grid and re-evaluate variables
                //show loading UI
                showLoading();

                var monitoring_grid = [];

                API.getMonitoringGrid()
                    .then(response => {
                        monitoring_grid = response.data;

                        utils.reconcileAllAgentsWithMonitoringGrid(  mapDetails.laser_agents, response.data, browserAdmin._id)
                                .then(lasers => {
                                    setMapDetails({
                                        ...mapDetails,
                                        monitoring_grid: monitoring_grid,
                                        laser_agents: lasers      
                                    })

                                    hideLoading();
                                })
                                .catch(err => {
                                    setMapDetails({
                                        ...mapDetails,
                                        monitoring_grid: monitoring_grid         
                                    })

                                    hideLoading();
                                })
                    })
                    .catch(err => {
                        setMapDetails({
                            ...mapDetails,
                            monitoring_grid: monitoring_grid         
                        })

                        hideLoading();
                    })
            }
        });

        getLocations();
        getEmergencies();


    }, [])

    function showLoading(){
        setMapDetails({...mapDetails, isLoading: true})
    }
  
    function hideLoading(){
        setMapDetails({...mapDetails, isLoading: false})
    }
  
    function logout(){
        logout();
    }

    const showMonitoredEmergency = async(e) => {
        const emergency_full_row = await utils.getAdminEmergencyMonitored(browserAdmin._id, mapDetails.monitoring_grid);
        
        if(emergency_full_row && emergency_full_row.emergency){
            var item = emergency_full_row.emergency;
            
            switch(item.laser_type){
                case "emergency":
                    setMapDetails({...mapDetails, clicked_user: item,
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

                case "call":
                    setMapDetails({...mapDetails, clicked_user: item,
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
                        clicked_marker_id: item._id})
                    break;
            }
        }
        else{
            setMapDetails({...mapDetails, action: "message",
            action_message: "You are not monitoring any emergency or call at the moment",})
        }
    }
    

    function showConfirmResolveEmergency(e){
        e.preventDefault();
        setMapDetails({...mapDetails, showConfirm: {
            action: "emergency",
            status: true
          },
          message: "Are you sure you want to mark this emergency issue as resolved ?"
        })
    }

    function showConfirmResolveLocation(){
        
        setMapDetails({...mapDetails, showConfirm: {
           
    
                  action: "location",
                  status: true
                },
                message: "Are you sure you want to mark this call as resolved ?"
            })
    }


const removeAgentFromRoute = async(e, agent) => {
    showLoading();

    const result = await utils.removeAgentFromBrowserAdminMonitoringGrid(agent, browserAdmin._id, mapDetails.monitoring_grid, mapDetails.laser_agents);
    
    if(result){
        //result[0] //monitoring_grid
        //result[1] //laser agents

        const save_result = await API.saveMonitoringGrid(result[0]);

        if(save_result){
            if(save_result.data==="successful"){
                //persist agents incase the user reloads the page or closes the browser
                var assigned_agents = persistence.getAssignedAgents();

                var new_assigned_agents = utils.removeAgentFromListOfAssignedAgentsForPersistsnce(agent, assigned_agents)
                
                if(new_assigned_agents.length > 0){
                    persistence.saveAssignedAgents(new_assigned_agents);
                }
                else{
                    persistence.deleteAssignedAgents();
                }


                //Refactor  ---------------------------------------------------------------------
                //unsubscribe from agents channel
                pubnub.unsubscribe({
                    channels: [agent.agent._id]
                })

                try{
                    //tell agent to leave the emergency
                    const result = await pubnub.publish(
                        {
                            message: {
                            pn_gcm: {
                                data: {
                                    notification_body: "You need to abandon route. Tap to open app",
                                    data: {},
                                    action: "leave_route"
                                }
                            }
                            },
                            channel: agent.agent._id,
                            sendByPost: false, // true to send via POST
                            storeInHistory: false //override default storage options
                        }
                    );
                }
                catch(status){

                }

                //Refactor End  ---------------------------------------------------------------------

                //we set state and update the monitoring grid and the laser agents list
               
                setMapDetails({...mapDetails, 
                    action: "message",
                    action_message: "Agent " +agent.agent.firstname +" was successfully removed from monitoring the emergency",
                    monitoring_grid: result[0],
                    laser_agents: result[1],
                    agent_side_bar_open: false,
                    clicked_agent: {},
                })

                hideLoading();
            }

            if(save_result.data === "unsuccessful"){
                hideLoading();
                setMapDetails({...mapDetails,
                    action: "message",
                    action_message: "An error occurred removing the agent from the emergency"
                })
            }
        }
        else{
           hideLoading();
           setMapDetails({...mapDetails,
                action: "message",
                action_message: "An error occurred removing the agent from the emergency"
            })
        }

    }
    else{
        hideLoading();
        setMapDetails({...mapDetails,
            action: "message",
            action_message: "An error occurred removing the agent from the emergency"
        })
    }
  }

  const removeAgentFromRouteAndCloseRouteResponse = async(e, route_response)=>{
    var agent = route_response.agent;

    showLoading();

    const result = await utils.removeAgentFromBrowserAdminMonitoringGrid(agent, browserAdmin._id,mapDetails.monitoring_grid,mapDetails.laser_agents);
    
    if(result){
        //result[0] //monitoring_grid
        //result[1] //laser agents

        const save_result = await API.saveMonitoringGrid(result[0]);

        if(save_result){
            if(save_result.data==="successful"){
                //persist agents incase the user reloads the page or closes the browser
                var assigned_agents = persistence.getAssignedAgents();

                var new_assigned_agents = utils.removeAgentFromListOfAssignedAgentsForPersistsnce(agent, assigned_agents)
                
                if(new_assigned_agents.length > 0){
                    persistence.saveAssignedAgents(new_assigned_agents);
                }
                else{
                    persistence.deleteAssignedAgents();
                }

                //Refactor  ---------------------------------------------------------------------

                //unsubscribe from agents channel
                pubnub.unsubscribe({
                    channels: [agent.agent._id]
                })

                //End Refactor  ---------------------------------------------------------------------


                var route_response_array =mapDetails.route_responses_from_agents;
  
                route_response_array.splice(route_response_array.indexOf(route_response),1);

                //persist route complete responses array
                persistence.saveCompletedEmergenciesResponse(route_response_array);


                //we set state and update the monitoring grid and the laser agents list
                setMapDetails({...mapDetails,
                    action: "message",
                    action_message: "Agent " +agent.agent.firstname +" was successfully removed from monitoring the emergency",
                    monitoring_grid: result[0],
                    laser_agents: result[1],
                    agent_side_bar_open: false,
                    clicked_agent: {},
                    route_responses_from_agents: route_response_array
                })

               hideLoading();
            }

            if(save_result.data === "unsuccessful"){
                hideLoading();
                setMapDetails({...mapDetails,
                    action: "message",
                    action_message: "An error occurred removing the agent from the emergency"
                })
            }
        }
        else{
           hideLoading();
            setMapDetails({...mapDetails,
                action: "message",
                action_message: "An error occurred removing the agent from the emergency"
            })
        }

    }
    else{
        hideLoading();
        setMapDetails({...mapDetails,
            action: "message",
            action_message: "An error occurred removing the agent from the emergency"
        })
    }
  }
  
  const addAgentToMonitoring = async (e, agent)=>{
      const monitored_result = utils.checkIfEmergencyMonitoredByBrowserAdmin(browserAdmin._id,mapDetails.monitoring_grid);

      if(monitored_result){
        var check_result = await utils.checkIfOtherAdminIsUsingAgent(browserAdmin._id, agent,mapDetails.monitoring_grid);
      
        if(check_result){
            setMapDetails({...mapDetails,
                action: "message",
                action_message: "Another admin has assigned agent " +agent.agent.firstname +" to an emergency"
            })
        }
        else{
                //we continue
                //add agent to monitoring grid and save on the server
                const grid_and_agents_array = await utils.setAgentOnMonitoringGridAndChangeAgentStatus(agent,mapDetails.monitoring_grid, browserAdmin._id,mapDetails.laser_agents);

                var new_monitoring_grid = grid_and_agents_array[0];
                var new_laser_agents = grid_and_agents_array[1];

                const result = await API.saveMonitoringGrid(new_monitoring_grid);
                
                if(result.data==="successful"){
                    //we get the emregency monitored from the monitoring grid which is the central source of truth
                    const emergency_full_row = await utils.getAdminEmergencyMonitored(browserAdmin._id,mapDetails.monitoring_grid);

                    var emergency_monitored = emergency_full_row.emergency;

                    if(emergency_monitored){

                        //Refactor  ---------------------------------------------------------------------

                        //we tell the agent to open the new route and go to the emergency or call
                        try{
                            const result = await pubnub.publish({
                                message: {
                                    pn_gcm: {
                                        data: {
                                            notification_body: "You have a new route. Tap to open app.",
                                            data: emergency_monitored.phone_number ? {full_name: emergency_monitored.full_name, _id: emergency_monitored.user, phone_number: emergency_monitored.phone_number, latitude: emergency_monitored.latitude, longitude: emergency_monitored.longitude} : {full_name: emergency_monitored.full_name, _id: emergency_monitored.user, latitude: emergency_monitored.latitude, longitude: emergency_monitored.longitude},
                                            action: "route_request"
                                        }
                                    }
                                },
                                channel: agent.agent._id,
                                sendByPost: false, // true to send via POST
                                storeInHistory: false //override default storage options
                            })
                        }
                        catch(status){

                        }


                        //Refactor End  ---------------------------------------------------------------------

                        //we subscribe the admin to the agents id channel
                        var list =mapDetails.channels_list;

                        if(list.indexOf(agent.agent._id)===-1){
                            list.push(agent.agent._id)
                        }

                        //Refactor  ---------------------------------------------------------------------

                        pubnub.subscribe({
                            channels: list
                        })

                        //End Refactor  ---------------------------------------------------------------------


                        //persist agents incase the user reloads the page or closes the browser
                        var assigned_agents = persistence.getAssignedAgents();

                        var new_assigned_agents = utils.addAgentToListOfAssignedAgentsForPersistence(agent, assigned_agents)
                        
                        persistence.saveAssignedAgents(new_assigned_agents);

                        //we then update state
                        setMapDetails({...mapDetails,
                            monitoring_grid: new_monitoring_grid,
                            laser_agents: new_laser_agents,
                            //channels_list: list,
                            action: "message",
                            action_message: "Agent "+agent.agent.firstname +" has been successfully assigned to the emergency"
                        })
                    }
                }

                if(result.data==="unsuccessful"){
                    //the grid was NOT successfully saved 
                        //show message
                        setMapDetails({...mapDetails,
                            action: "message",
                            action_message: "The system could NOT successfully assign the agent to the emergency"
                        })
                }
        }
      }
      else{

      }
  }
    


  const startMonitoring= async (e, item)=>{
        
    try{
        //check if another admin is monitoring the emergency
        const boolean_value = await utils.checkIfEmergencyMonitoredByOtherAdmin(  mapDetails.monitoring_grid, item, browserAdmin._id);

        if(boolean_value){
            //the emergency is being monitored by another admin
            //tell the browser admin about this
            setMapDetails({...mapDetails,
                action: "message",
                action_message: "Another admin is already monitoring the selected emergency"
            })
        }
        else{
            //we continue by editing the monitoring_grid and persisting it
            const new_monitoring_grid = await utils.setEmergencyOnMonitoringGrid(item,mapDetails.monitoring_grid, browserAdmin._id);
            
            const result = await API.saveMonitoringGrid(new_monitoring_grid);
            
            if(result.data==="successful"){
                //the grid was successfully saved 
                //change monitoring grid in local state
                //subscribe to channel if user chose to be tracked
                //show message

                var list =mapDetails.channels_list ?mapDetails.channels_list : [];

                //we subscribe to the items channel ONLY if the item is trackable
                if(item.is_trackable){ 
                    if(list.indexOf(item.user)===-1){
                        //remove old user from list
                        //unsubscribe from old user
            
                        list.push(item.user)
                    }

                    //Refactor  ---------------------------------------------------------------------

                    pubnub.subscribe({
                        channels: list
                    })

                    //Refactor End  ---------------------------------------------------------------------
                }
                
                setMapDetails({...mapDetails,
                    action: "message",
                    action_message: "You are now monitoring "+item.full_name,
                    channels_list: list,
                    monitoring_grid: new_monitoring_grid
                })  
            }

            if(result.data==="unsuccessful"){
                //the grid was NOT successfully saved 
                //show message
                setMapDetails({...mapDetails,
                    action: "message",
                    action_message: "The system could not initiate the monitoring of that emergency"
                })
            }
                        
        }
    }
    catch(err){
        console.log({err})
        //show message
        setMapDetails({...mapDetails,
            action: "message",
            action_message: "Error occurred initiating monitoring of emergency"
        })
    }
}


const hideConfirm = () => {
      setMapDetails({...mapDetails,
        showConfirm: {
          action: "",
          status: false
        },
        message: ""
    })
}

const closeAction = (e) => {
    setMapDetails({...mapDetails,
        action: "close",
        action_message: ""
    })
}

const closeSideBar = (e) => {
    setMapDetails({...mapDetails,
        play_sound: false,
        side_bar_open: false,
        location_side_bar_open: false,
        manual_location_side_bar: false,
        agent_side_bar_open: false,
        selected_location: {},
        selected_emergency: {},
        clicked_marker_id: ""
    })
}

const closeAgentSideBar = (e) => {
    setMapDetails({...mapDetails,
        clicked_agent: {},
        agent_side_bar_open: false
    })
}

const closeRouteResponse = (route_response) => {
    let array = mapDetails.route_responses_from_agents;

    array.splice(array.indexOf(route_response),1);

    setMapDetails({
        ...mapDetails,
        route_responses_from_agents: array
    })
}

const getSelectedAgentsIds = () =>{
    
}

const setSelectedAgentsFromIds = (ids) => {
    
}

//we get the monitoring grid from the server and update our variables
const getMonitoringGridFromServerAndReconcileAssignedAgents = async () => {
        showLoading();
        const response = await API.getMonitoringGrid();

        if(response){
            setUpAssignedAgentsIfAny(response.data);
           
            utils.getAdminEmergencyMonitored(browserAdmin._id, response.data)
                    .then(emergency_full_row => {
                        var admin_emergency = emergency_full_row.emergency;

                        if(admin_emergency){
                            
                            //we need to subscribe to the emergencies user id to receive location updates
                            if(  mapDetails.channels_list.indexOf(admin_emergency.user) === -1){
                                var list =   mapDetails.channels_list.concat([admin_emergency.user]);
                                
                                //Refactor  ---------------------------------------------------------------------

                                pubnub.subscribe({
                                    channels: list
                                })

                                //Refactor End ---------------------------------------------------------------------
            
                                  setMapDetails({...mapDetails,
                                    action: "message",
                                    action_message: "You are monitoring "+admin_emergency.full_name,
                                    monitoring_grid: response.data,
                                    channels_list: list
                                })
                                hideLoading();
                            }
                            else{

                                //Refactor  ---------------------------------------------------------------------

                                pubnub.subscribe({
                                    channels:   mapDetails.channels_list
                                })

                                //Refactor End  ---------------------------------------------------------------------
            
                                  setMapDetails({...mapDetails,
                                    action: "message",
                                    action_message: "You are monitoring "+admin_emergency.full_name,
                                    monitoring_grid: response.data
                                })
                                hideLoading();
                            }
                        }
                        else{
                              setMapDetails({...mapDetails,
                                monitoring_grid: response.data
                            })
                            hideLoading();
                        }
                    })
                    .catch(err => {
                        setMapDetails({...mapDetails,
                            monitoring_grid: response.data
                        })
                        hideLoading();
                    })
        }
        else{
            //show appropriate message
            setMapDetails({...mapDetails,
                action: "message",
                action_message: "An error occurred. Please check the network."
            })
            hideLoading();
        }
  }

  const setUpAssignedAgentsIfAny = async(monitoring_grid) => {
      var assigned_agents = persistence.getAssignedAgents();

      if(assigned_agents && assigned_agents.length > 0){
            var result = await utils.reconcileAssignedAgentsListWithMonitoringGrid(browserAdmin._id, assigned_agents, monitoring_grid);
    
            //result[0] //assigned agents list
            //result[1] //laser agents
    
            if(result[0].length > 0){
                persistence.saveAssignedAgents(result[0]);

                //we subscribe to the id of each agent
                let list = mapDetails.channels_list.concat(result[0]);
                
                //Refactor  ---------------------------------------------------------------------

                pubnub.subscribe({
                    channels: list
                })

                //Refactor End  ---------------------------------------------------------------------

                setMapDetails({...mapDetails,
                    laser_agents: result[1],
                    channels_list: list
                })
            }
            else{
                persistence.deleteAssignedAgents();

                setMapDetails({...mapDetails,
                    laser_agents: result[1]
                })
            }
      }
  }


  const removeAgentFromEmergencyAfterDecliningRequest = async (agent) =>{
    showLoading();

    const result = await utils.removeAgentFromBrowserAdminMonitoringGrid(agent, browserAdmin._id,   mapDetails.monitoring_grid,   mapDetails.laser_agents);
    
    if(result){
        //result[0] //monitoring_grid
        //result[1] //laser agents

        const save_result = await API.saveMonitoringGrid(result[0]);

        if(save_result){
            if(save_result.data==="successful"){
                //persist agents incase the user reloads the page or closes the browser
                var assigned_agents = persistence.getAssignedAgents();

                var new_assigned_agents = utils.removeAgentFromListOfAssignedAgentsForPersistsnce(agent, assigned_agents)
                
                if(new_assigned_agents.length > 0){
                    persistence.saveAssignedAgents(new_assigned_agents);
                }
                else{
                    persistence.deleteAssignedAgents();
                }

                //Refactor  ---------------------------------------------------------------------

                //unsubscribe from agents channel
                pubnub.unsubscribe({
                    channels: [agent.agent._id]
                })

                //Refactor End  ---------------------------------------------------------------------

                //we set state and update the monitoring grid and the laser agents list
                setMapDetails({...mapDetails,
                    action: "message",
                    action_message: "Agent " +agent.agent.firstname +" declined the request to attend to the emergency",
                    monitoring_grid: result[0],
                    laser_agents: result[1],
                    agent_side_bar_open: false,
                    clicked_agent: {},
                })

                hideLoading();
            }

            if(save_result.data === "unsuccessful"){
                hideLoading();
                setMapDetails({...mapDetails,
                    action: "message",
                    action_message: "An error occurred removing the agent from the emergency"
                })
            }
        }
        else{
            hideLoading();
            setMapDetails({...mapDetails,
                action: "message",
                action_message: "An error occurred removing the agent from the emergency"
            })
        }

    }
    else{
        hideLoading();
        setMapDetails({...mapDetails,
            action: "message",
            action_message: "An error occurred removing the agent from the emergency"
        })
    }
}



  //this is not showing the agents in the same lga
  const getAgentsAroundEmergency = async () => {
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
  
        if(mapDetails.locations.length>0){
            if(value==="Calls (All)"){
              setMapDetails({
                  ...mapDetails,
                  play_sound: false,
                  filtered_locations: mapDetails.locations,
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
                                url: (mapDetails.clicked_marker_id===loc._id) ? blue_circle : call_icon
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


  const getEmergencies = async() => {
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
        var loc = mapDetails.latest;

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



const getLocations = async() => {

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
        var loc = mapDetails.latest;

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

const saveManualLocation = async(location) => {
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


const getLocationsDate = async(date) => {
    const response = await API.getLocations({date})
    
    if(response=="error"){
        setMapDetails({
            ...mapDetails,
            action: "err_calls_load",
            locations: [],
            filtered_locations: []
        })

        return;
    }

    if(response&&response.data&&response.data.locations){
        if(mapDetails.action === "loading"){
            setMapDetails({
                ...mapDetails,
                action: "close",
                locations: response.data.locations,
                filtered_locations: response.data.locations
            })
        }
        else{
            setMapDetails({
                ...mapDetails,
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

const getEmergenciesDate = async(date) => {
    const response = await API.getEmergencies({date})
    
    if(response=="error"){
        setMapDetails({
            ...mapDetails,
            action: "err_emergency_load",
            emergencies: [],
            filtered_emergencies: []
        })
        return;
    }

    if(response&&response.data&&response.data.emergencies){
        if(mapDetails.action === "loading"){
            setMapDetails({
                ...mapDetails,
                action: "close",
                emergencies: response.data.emergencies,
                filtered_emergencies: response.data.emergencies
            })
        }
        else{
            setMapDetails({
                ...mapDetails,
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


return <div className="laser-parent-div" style={mapStyle}>
            <Latest latest={  mapDetails.latest} latestClicked={latestClicked}/>
            {mapDetails.show_location_side_bar}
            {mapDetails.show_side_bar}
            {  mapDetails.showConfirmManualLocation ? <ConfirmAddressNotFound closeConfirmAddressNotFoundClicked={continueConfirmAddressNotFoundClicked} tryAgainClicked={continueConfirmAddressNotFoundClicked} hideConfirmManualLocation={hideConfirmManualLocation} /> : ""}
            {  mapDetails.manual_location_side_bar ? <AddCallManually onFieldChanged={onFieldChanged} closeSidebar={closeSideBar} selected_manual_call={  mapDetails.selected_manual_call} selected_manual_gender={  mapDetails.selected_manual_gender} manual_address={  mapDetails.manual_address} manual_name={  mapDetails.manual_name} onManualCallChanged={onManualCallChanged} onManualGenderChanged={onManualGenderChanged}  onSubmitManualCallDetails={onSubmitManualCallDetails}/> : "" }
            
            { 
                mapDetails.agent_side_bar_open ? <AgentDetails removeAgentFromRoute={removeAgentFromRoute} closeAgentSideBar={closeAgentSideBar} addAgentToMonitoring={addAgentToMonitoring} agent={  mapDetails.clicked_agent} user={  mapDetails.clicked_user}/> : "" 
            }

            <TopPanel showMonitoredEmergency={showMonitoredEmergency} openManualLocation={openManualLocation} logout={logout} onCalendarOpen={onCalendarOpen} onDateChange={onDateChange} date={  mapDetails.date} selected_call={  mapDetails.selected_call} 
            onCallsChanged={onCallsChanged} selected_emergency={  mapDetails.selected_emergency} onEmergenciesChanged={onEmergenciesChanged} getAgentsAroundEmergency={getAgentsAroundEmergency}/>

            <Map google={google} 
                style={mapStyle}
                onReady={mapDetails.fetchPlaces}
                initialCenter={  mapDetails.center}
                center={  mapDetails.center}
                zoom={  mapDetails.zoom}>
        
                {getLocationsMarkers()}
                {getEmergenciesMarkers()}
                {getAgentMarkers()}

            </Map>
            
            <Loader isLoading={  mapDetails.isLoading}/>

            <Action action={  mapDetails.action} closeAction={closeAction} message={  mapDetails.action_message}/>

            <Loader isLoading={  mapDetails.isLoading}/>

            {mapDetails.sound}

            {
                mapDetails.route_responses_from_agents.length > 0 ?  <RouteStatus route_response={  mapDetails.route_responses_from_agents[  mapDetails.route_responses_from_agents.length - 1]} removeAgentFromRouteAndCloseRouteResponse={removeAgentFromRouteAndCloseRouteResponse} closeRouteResponse={closeRouteResponse} /> : ""
            }

            {
                mapDetails.showConfirm.status===true ? <ConfirmAction  yesClicked={  mapDetails.showConfirm.action==="emergency" ? mapDetails.resolveEmergency : mapDetails.resolveCall} noClicked={hideConfirm} message={  mapDetails.message} /> : ""
            }
    </div>
}

export default GoogleApiWrapper({
    apiKey: ('AIzaSyADNxHcgsHDyx_OSbqxBg5xB5lV2YJDcKI')
})(Dashboard)