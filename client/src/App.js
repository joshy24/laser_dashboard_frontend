import React, {Component} from 'react';
import logo from './logo.svg';
import red_circle from './icons/emergency_with_circle.gif';
import blue_circle from './icons/call_with_circle.gif';
import emergency_icon from './icons/emergency.gif';
import call_icon from './icons/call.gif';
import car_test from './icons/car_test.png';


//import police_car from './icons/vector/police_car.svg'
//import police_car_enroute from './icons/vector/police_car_yellow.svg'

import police_car from './icons/police_car.png'
import police_car_enroute from './icons/police_car_yellow.png'

import fire_car from './icons/fire_truck.png'
import fire_car_enroute from './icons/fire_truck_yellow.png'

import ambulance from './icons/ambulance.png'
import ambulance_enroute from './icons/ambulance_yellow.png'

/*import police_car_right from './icons/police_car_right.png'
import fire_car_right from './icons/fire_truck_right.png'
import ambulance_car_right from './icons/ambulance_right.png'

import police_car_left from './icons/police_car_left.png'
import fire_car_left from './icons/fire_truck_left.png'
import ambulance_car_left from './icons/ambulance_left.png'

import police_car_right_enroute from './icons/police_car_right_enroute.png'
import fire_car_right_enroute from './icons/fire_truck_right_enroute.png'
import ambulance_car_right_enroute from './icons/ambulance_right_enroute.png'

import police_car_left_enroute from './icons/police_car_left_enroute.png'
import fire_car_left_enroute from './icons/fire_truck_left_enroute.png'
import ambulance_car_left_enroute from './icons/ambulance_left_enroute.png'*/

import alert from "./sounds/alert.mp3";
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import socketIOClient from "socket.io-client";
import Sidebar from './components/Sidebar';
import Action from './components/Action';
import AgentDetails from './components/AgentDetails';
import LocationSidebar from './components/LocationSideBar';
import TopPanel from './components/TopPanel';
import Latest from './components/Latest';
import RouteStatus from './components/RouteStatus';
import ConfirmAction from './components/ConfirmAction';
import Utils from './utils/Utils';
import Persistence from './utils/Persistence';
import Sound from 'react-sound';
import PubNubReact from 'pubnub-react';

import './App.css';

import * as API from './api/Api';

import AuthHelperMethods from './auth/AuthHelperMethods';

const utils = new Utils();
const persistence = new Persistence();

const mapStyle = {
    height: '100vh', 
    width: '100%'
}

const socket_io_url = 'http://52.59.255.174';
//const socket_io_url = 'http://localhost:3077';

let todays_date = new Date().toISOString();

let today = null;

class App extends Component{
  constructor(props){
      super(props);

      this.state = {
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
          channels_list: ["lllaser", "agent_tracked", "agent_untracked", "users_monitored", "issue_resolved", "request_tracked", "response_tracked"],
          laser_agents:[], //all agents
          selected_agents: [], //selected agents to resolve issues
          route_responses_from_agents: [],
          tracked_users: [],
          action: "loading",
          action_message: "",
          tracked_area: "lllaser", //the user in which the admin is currently viewing whether the user wants to be tracked or not
          date: new Date(),
          message: ""
      }
      
      this.pubnub = new PubNubReact({
        publishKey: 'pub-c-100b3918-0e25-4fac-ade6-c58d013cd019',
        subscribeKey: 'sub-c-21e1e450-9457-11e9-bf84-1623aee89087'
      });
      this.pubnub.init(this);

      this.closeSideBar = this.closeSideBar.bind(this);
      this.onCallsChanged = this.onCallsChanged.bind(this);
      this.onEmergenciesChanged = this.onEmergenciesChanged.bind(this);
      this.onAgentClicked = this.onAgentClicked.bind(this);
      this.onDateChange = this.onDateChange.bind(this);
      this.onCalendarOpen = this.onCalendarOpen.bind(this);
      this.latestClicked = this.latestClicked.bind(this);
      this.startMonitoring = this.startMonitoring.bind(this);
      this.closeAction = this.closeAction.bind(this);
      this.closeAgentSideBar = this.closeAgentSideBar.bind(this);
      this.addAgentToMonitoring = this.addAgentToMonitoring.bind(this);
      this.getAgentIcon = this.getAgentIcon.bind(this);
      this.subscribeAndGetAllAgentsLocation = this.subscribeAndGetAllAgentsLocation.bind(this);
      this.handleSongFinishedPlaying = this.handleSongFinishedPlaying.bind(this);
      this.removeAgentFromRoute = this.removeAgentFromRoute.bind(this);
      this.closeRouteResponse = this.closeRouteResponse.bind(this);
      this.removeAgentFromRouteAndCloseRouteResponse = this.removeAgentFromRouteAndCloseRouteResponse.bind(this);

      this.getEmergencies = this.getEmergencies.bind(this);
      this.getLocations = this.getLocations.bind(this);
      this.getLocationsDate = this.getLocationsDate.bind(this);
      this.getEmergenciesDate = this.getEmergenciesDate.bind(this);
      this.getLatestEmergencies = this.getLatestEmergencies.bind(this);
      this.getLatestLocations = this.getLatestLocations.bind(this);

      this.getSelectedAgentsIds = this.getSelectedAgentsIds.bind(this);
      this.setSelectedAgentsFromIds = this.setSelectedAgentsFromIds.bind(this);

      this.resolveCall = this.resolveCall.bind(this);
      this.resolveEmergency = this.resolveEmergency.bind(this);
      this.hideConfirm = this.hideConfirm.bind(this);
      this.showConfirmResolveEmergency = this.showConfirmResolveEmergency.bind(this);
      this.showConfirmResolveLocation = this.showConfirmResolveLocation.bind(this);

      this.logout = this.logout.bind(this);
    
      var year = todays_date.split(/T(.+)/)[0];

      year = year+"T00:00:00.000Z";

      today = new Date(year);
  }

  logout(){
      this.props.logout();
  }

  async resolveEmergency(){
      this.setState({
          showConfirm: {
            action: "",
            status: false
          },
          message: "",
          action: "loading",
          action_message: ""
      })

      const response = await API.resolveEmergency({id: this.state.clicked_user._id})

      if(response=="error"){
            this.setState({
                action: "message",
                action_message: "Emergency could not be resolved. Try again later"
            })
            return;
      }
      
      if(response){
          this.pubnub.publish(
                {
                    message: {
                        
                    },
                    channel: "issue_resolved",
                    sendByPost: false, // true to send via POST
                    storeInHistory: false //override default storage options
                },
                (status, response) => {
                    // handle status, response
                }
          );

          this.setState(state => {
                var tracked_users = state.tracked_users;
                
                tracked_users.splice(tracked_users.indexOf(this.state.clicked_user._id), 1);

                persistence.saveTrackedUsers(tracked_users);

                return {
                    action: "close",
                    side_bar_open: false,
                    tracked_users: tracked_users
                }
          })

          this.getLocationsDate(this.state.date);
          this.getEmergenciesDate(this.state.date);

          this.setState({
              latest: []
          })

          this.getLatestLocations();
          this.getLatestEmergencies();
      }
  }

  async resolveCall(){
      this.setState({
          showConfirm: {
            action: "",
            status: false
          },
          message: "",
          action: "loading",
          action_message: ""
      })

      const response = await API.resolveLocation({id: this.state.clicked_user._id})

      if(response=="error"){
        this.setState({
            action: "message",
            action_message: "Call could not be resolved. Try again later"
        })
      }
        
      if(response){
          this.pubnub.publish(
                {
                    message: {

                    },
                    channel: "issue_resolved",
                    sendByPost: false, // true to send via POST
                    storeInHistory: false //override default storage options
                },
                (status, response) => {
                    // handle status, response
                }
          );

          this.setState(state =>{
              var locations = state.locations;

              locations.splice(locations.indexOf(state.clicked_user))

              return {
                locations: locations,
                action: "close",
                location_side_bar_open: false
              }
          })

          this.getLocationsDate(this.state.date);
          this.getEmergenciesDate(this.state.date);

          this.setState({
                latest: []
          })

          this.getLatestLocations();
          this.getLatestEmergencies();
      }
  }

  hideConfirm(){
      this.setState({
          showConfirm: {
            action: "",
            status: false
          },
          message: ""
      })
  }

  showConfirmResolveEmergency(e){
      e.preventDefault();
      this.setState({
          showConfirm: {
            action: "emergency",
            status: true
          },
          message: "Are you sure you want to mark this emergency issue as resolved ?"
      })
  }

  showConfirmResolveLocation(){
      this.setState({
          showConfirm: {
            action: "location",
            status: true
          },
          message: "Are you sure you want to mark this call as resolved ?"
      })
  }

  removeAgentFromRoute(e, agent){
      e.preventDefault();

      this.pubnub.publish(
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
          },
          (status, response) => {
              // handle status, response
          }
      );

      //tell other browsers about the agent being montiored
      this.pubnub.publish(
        {
            message: {
                agent
            },
            channel: "agent_untracked",
            sendByPost: false, // true to send via POST
            storeInHistory: false //override default storage options
        },
        (status, response) => {
            // handle status, response
        }
      );

      this.setState(state => {
          var agents = state.selected_agents;
          var list = state.channels_list;
          var laser_agents = state.laser_agents;
          
          var new_selected_agents = [];

          if(agents.length > 1){
              new_selected_agents = agents.map(age => {
                  if(age && (age.agent._id !== agent.agent._id)){
                      return age;
                  }
              })
          }

          var new_list = list.splice(list.indexOf(agent.agent._id), 1);

          var found_agent = laser_agents.find(age => age.agent._id === agent.agent._id);

          var new_found_agent = Object.assign({}, found_agent);

          new_found_agent.is_on_route = false;

          var new_laser_agents = laser_agents.splice(laser_agents.indexOf(found_agent), 1, new_found_agent);

          //unsubscribe to the agents id to receive a response to the route request
          this.pubnub.unsubscribe({
             channels: [agent.agent._id]
          })
          
          persistence.saveSelectedAgents(new_selected_agents);

          return {  
              selected_agents: new_selected_agents,
              laser_agents: laser_agents,
              channels_list: new_list,
              agent_side_bar_open: false,
              clicked_agent: {}
          }
      })
  }

  removeAgentFromRouteAndCloseRouteResponse(e, agent, route_response){
      e.preventDefault();

      this.pubnub.publish(
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
          },
          (status, response) => {
              // handle status, response
          }
      );

      //tell other browsers about the agent being montiored
      this.pubnub.publish(
                {
                    message: {
                        agent
                    },
                    channel: "agent_untracked",
                    sendByPost: false, // true to send via POST
                    storeInHistory: false //override default storage options
                },
                (status, response) => {
                    // handle status, response
                }
      );

      this.setState(state => {
          var agents = state.selected_agents;
          var list = state.channels_list;
          var array = state.route_responses_from_agents;

          array.splice(array.indexOf(route_response),1);
          
          var new_selected_agents = [];
          
          if(agents.length > 1){
              new_selected_agents = agents.map(age => {
                  
                  if(age.agent._id!==agent.agent._id){
                      return age;
                  }
              })
          }

          var new_list = list.splice(list.indexOf(agent.agent._id), 1);

          //subscribe to the agents id to receive a response to the route request
          this.pubnub.unsubscribe({
                channels: [agent.agent._id]
          })

          persistence.saveSelectedAgents(new_selected_agents);

          return {  
              selected_agents: new_selected_agents,
              channels_list: new_list,
              route_responses_from_agents: array,
              agent_side_bar_open: false,
              clicked_agent: {}
          }
      })
  }
  
  addAgentToMonitoring(e, agent){
      e.preventDefault();
      //send a request to the agent via pubnub
      //wait for response
      //if agent accepts set agent as on route
      this.pubnub.publish(
          {
            message: {
                pn_gcm: {
                    data: {
                        notification_body: "You have a new route. Tap to open app.",
                        data: this.state.clicked_user.phone_number ? {full_name: this.state.clicked_user.full_name, _id: this.state.clicked_user.user, phone_number: this.state.clicked_user.phone_number, latitude: this.state.clicked_user.latitude, longitude: this.state.clicked_user.longitude} : {full_name: this.state.clicked_user.full_name, _id: this.state.clicked_user.user, latitude: this.state.clicked_user.latitude, longitude: this.state.clicked_user.longitude},
                        action: "route_request"
                    }
                }
            },
            channel: agent.agent._id,
            sendByPost: false, // true to send via POST
            storeInHistory: false //override default storage options
          },
          (status, response) => {
              // handle status, response
          }
      );


      //tell other browsers about the agent being montiored
      this.pubnub.publish(
            {
                message: {
                    agent
                },
                channel: "agent_tracked",
                sendByPost: false, // true to send via POST
                storeInHistory: false //override default storage options
            },
            (status, response) => {
                // handle status, response
                console.log({status})
                console.log({response})
            }
      );

      this.setState(state => {
          var agents = state.selected_agents;
          var list = state.channels_list;

          var new_selected_agents = [];

          if(agents.length > 0){
              new_selected_agents = agents.map(a => {
                
                if(!a || (a.agent._id === agent.agent._id)){
                  return agent;
                }
                else{
                    return a;
                }
              })

              var found_agent = new_selected_agents.find(a => a.agent._id === agent.agent._id)

              if(!found_agent){
                new_selected_agents.push(agent)
              }
          }
          else{
              new_selected_agents.push(agent)
          }
          
          if(list.indexOf(agent.agent._id)===-1){
            list.push(agent.agent._id)
          }

          //subscribe to the agents id to receive a response to the route request
          this.pubnub.subscribe({
            channels: list
          })

          persistence.saveSelectedAgents(new_selected_agents);

          return {  
            selected_agents: new_selected_agents,
            channels_list: list
          }
      })
  }

  //Subscribe to the users sub admin area to receive updates and send out a request to all agents on the channel to send their location 
  //just in case some of them are not moving at the momemnt and their location is not updating
  startMonitoring(e, item){
      e.preventDefault();
     
      this.pubnub.publish(
          {
              message: {
                    pn_gcm: {
                        data: {
                            notification_body: "Tap to open the laser App",
                            data: {},
                            action: "send_location"
                        }
                    }
              },
              channel: this.state.tracked_area,
              sendByPost: false, // true to send via POST
              storeInHistory: false //override default storage options
          },
          (status, response) => {
              // handle status, response
          }
      );
      
      this.setState(state => {
            var list = state.channels_list;
            var tracked_users = state.tracked_users;

            if(list.indexOf(item.user)===-1){
                    //remove old user from list
                    //unsubscribe from old user
        
                    list.push(item.user)
            }

            var found_user = tracked_users.find(id => id === item.user);
            
            if(!found_user){
                tracked_users.push(item.user);
            }

            persistence.saveTrackedUsers(tracked_users);

            this.pubnub.subscribe({
                channels: list
            })

            return {
                action: "message",
                action_message: "You are now monitoring "+item.full_name,
                channels_list: list,
                laser_agents: [],
                tracked_users: tracked_users
            }
      })
  }

  latestClicked(item){
      switch(item.laser_type){
          case "emergency":
              this.setState({
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
              this.setState({
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

  onCalendarOpen(){
      this.setState({
        play_sound: false,
        side_bar_open: false, 
        location_side_bar_open: false,
        agent_side_bar_open: false
      })
  }

  onDateChange(date){

    //We add 1 hour to the date because the date axios is sending to the server is 1 hour behind what it should be
    date = new Date(date);
    date.setHours(date.getHours() + 1);

     this.setState({
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

     this.getLocationsDate(date);
     this.getEmergenciesDate(date);
  }

  onCallsChanged(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;

      let arr = [];

      if(this.state.locations.length>0){
          if(value==="Calls (All)"){
            this.setState(state => ({
              play_sound: false,
              filtered_locations: state.locations,
              side_bar_open: false, 
              selected_call: value,
              agent_side_bar_open: false,
              location_side_bar_open: false,
              show_blue_circle: false
            }))
          }
          else if(value==="None"){
            this.setState({
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
            this.state.locations.map(emer => {
              if(emer.reason.includes(value.toLowerCase())){
                arr.push(emer)
              }
            })
            
            if(arr.length>0){
              this.setState({
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
      
              this.setState({
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
          this.setState({
              selected_call: value
          })
      }
  }

  onEmergenciesChanged(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;
      
      let arr = [];
      if(this.state.emergencies.length>0){
          if(value==="Emergencies (All)"){
            this.setState(state => ({
              play_sound: false,
              filtered_emergencies: state.emergencies,
              side_bar_open: false, 
              selected_emergency: value,
              location_side_bar_open: false,
              agent_side_bar_open: false,
              show_red_circle: false
            }))
          }
          else if(value==="None"){
            this.setState({
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
            this.state.emergencies.map(emer => {
              if(emer.reasons&&emer.reasons.length>0){
                emer.reasons.map(reason => {
                    if(value.toLowerCase().includes(reason)){
                        arr.push(emer)
                    }
                })
              }
            })
      
            if(arr.length>0){
              this.setState({
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
      
              this.setState({
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
          this.setState({
             selected_emergency: value
          })
      }
  }

  onLocationClicked(location,e){
      this.setState({
          play_sound: false,
          clicked_user: location,
          side_bar_open: false,
          agent_side_bar_open: false,
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

  onEmergencyClicked(emergency,e){
      this.setState({
          play_sound: false,
          clicked_user: emergency,
          clicked_agent: {},
          side_bar_open: true,
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

  onAgentClicked(agent,e){
      this.setState({
          play_sound: false,
          clicked_agent: agent,
          agent_side_bar_open: true
    })
  }

  getLocationsMarkers(){
        let locations_ui;

        if(this.state.filtered_locations.length>0){
            locations_ui = this.state.filtered_locations.map(loc => {
                return  <Marker key={loc._id} onClick={e => this.onLocationClicked(loc,e)}
                            name={loc.reason} 
                            title={loc.full_name}
                            position={{lat: loc.latitude, lng: loc.longitude}}
                            icon={{
                                url: (this.state.clicked_marker_id===loc._id) ? blue_circle : call_icon
                            }}/> 
            })
        }
        else{
            locations_ui = "";
        }
        
        return locations_ui;
  }

  getEmergenciesMarkers(){
      let emergencies_ui;

      if(this.state.filtered_emergencies.length>0){
          emergencies_ui = this.state.filtered_emergencies.map(emer => {
            return <Marker key={emer._id} onClick={e => this.onEmergencyClicked(emer,e)}
                      name={emer.reasons[0]} 
                      title={emer.full_name}
                      position={{lat: emer.latitude, lng: emer.longitude}}
                      icon={{
                        url: (this.state.clicked_marker_id===emer._id) ? red_circle : emergency_icon
                      }}/>
          })
      }
      else{
          emergencies_ui = "";
      }
      
      return emergencies_ui;
  }

  getAgentMarkers(){
      let agents_ui;

      if(this.state.laser_agents.length>0){
            agents_ui = this.state.laser_agents.map((agent,i) => {
                return <Marker key={i}  onClick={e => this.onAgentClicked(agent,e)}
                            name={agent.full_address} 
                            title={agent.full_address}
                            position={{lat: agent.latitude, lng: agent.longitude}}
                            //
                            icon={{
                                url: this.getAgentIcon(agent),
                                anchor: new this.props.google.maps.Point(40,40),
                                scaledSize: new this.props.google.maps.Size(40,40)
                            }}/>
            })
      }
      else{
            agents_ui = "";
      }

      return agents_ui;
  }

  getAgentIcon(agent){
      if(agent){
            if(this.state.selected_agents.length > 0){
                this.state.selected_agents.map(age => {
                    if(age){
                        if(agent.agent._id === age._id){
                            agent.is_on_route = true;
                        }
                    }
                })
            }
    
            switch(agent.agent.department){
                case "police":
                    if(agent.bearing>90||agent.bearing<=270){
                        return (agent.is_on_route) ? police_car_enroute : police_car;
                    }
                    else{
                        return (agent.is_on_route) ? police_car_enroute : police_car;
                    }
                break;
                case "fire":
                    if(agent.bearing>90||agent.bearing<=270){
                        return (agent.is_on_route) ? fire_car_enroute : fire_car;
                    }
                    else{
                        return (agent.is_on_route) ? fire_car_enroute : fire_car;
                    }
                break;
                case "hospital":
                    if(agent.bearing>90||agent.bearing<=270){
                        return (agent.is_on_route) ? ambulance_enroute: ambulance;
                    }
                    else{
                        return (agent.is_on_route) ? ambulance_enroute : ambulance;
                    }
                break;
            }
      }
  }

  closeAction(e){
      this.setState({
          action: "close",
          action_message: ""
      })
  }

  closeSideBar(e){
      this.setState({
          play_sound: false,
          side_bar_open: false,
          location_side_bar_open: false,
          agent_side_bar_open: false,
          selected_location: {},
          selected_emergency: {},
          clicked_marker_id: ""
      })
  }

  closeAgentSideBar(e){
      this.setState({
          clicked_agent: {},
          agent_side_bar_open: false
      })
  }

  closeRouteResponse(route_response){
      this.setState(state => {
          var array = state.route_responses_from_agents;

          array.splice(array.indexOf(route_response),1);

          return {
              route_responses_from_agents: array
          }
      })
  }

  fetchPlaces(mapProps, map) {

  }

  subscribeAndGetAllAgentsLocation(){
      this.pubnub.subscribe({
        channels: this.state.channels_list
      })

      this.setState({
        laser_agents: []
      })

      this.pubnub.publish(
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
            channel: this.state.tracked_area,
            sendByPost: false, // true to send via POST
            storeInHistory: false //override default storage options
        },
        (status, response) => {
            // handle status, response
        }
      );
  }

  getSelectedAgentsIds(){
      
      if(this.state.selected_agents.length>0){
            var ids = [];

            this.state.selected_agents.map(agent => {
                if(agent!==null){
                    ids.push(agent.agent._id);
                }
            });

            return ids;
      }
      else{
          return [];
      }
  }

  setSelectedAgentsFromIds(ids){
      this.setState(state => {
          var laser_agents = state.laser_agents;

          var selected_agents = state.selected_agents;

          laser_agents.map(agent => {
              var found_agent_id = ids.find(id =>  id === agent.agent._id);

              if(found_agent_id){
                  var found = selected_agents.find(sel => sel.agent._id === found_agent_id)

                  if(!found){
                      selected_agents.push(agent);
                  }
              }
          });

          persistence.saveSelectedAgents(selected_agents);

          return {
              selected_agents: selected_agents
          }

      });
  }

  componentWillUnmount() {
      this.pubnub.unsubscribe({
          channels: this.state.channels_list
      });
  }

  componentDidMount(){

    //get selected agents from persistence(storage)
    var persisted_agents = persistence.getSelectedAgents();
    
    if(persisted_agents!==null && persisted_agents.length > 0){
        this.setState({
            selected_agents: persisted_agents
        })
    }

    var persisted_tracked_users = persistence.getTrackedUsers();
    
    if(persisted_tracked_users!==null && persisted_tracked_users.length > 0){
        this.setState({
            tracked_users: persisted_tracked_users
        })
    }

    //subscribe to the parent channel to receive location updates from agents
    this.pubnub.subscribe({
        channels: this.state.channels_list
    })

    this.subscribeAndGetAllAgentsLocation();

    this.pubnub.addListener({
      status: (st) => {
            if(st.category === "PNNetworkUpCategory"){
                this.pubnub.publish(
                    {
                        message: {
                            
                        },
                        channel: "request_tracked",
                        sendByPost: false, // true to send via POST
                        storeInHistory: false //override default storage options
                    },
                    (status, response) => {
                        // handle status, response
                    }
                );

                this.setState({
                    action: "message",
                    action_message: "You are online."
                })
            }

            if(st.category === "PNConnectedCategory"){
                this.pubnub.publish(
                    {
                        message: {
                            
                        },
                        channel: "request_tracked",
                        sendByPost: false, // true to send via POST
                        storeInHistory: false //override default storage options
                    },
                    (status, response) => {
                        // handle status, response
                    }
                );

                this.setState({
                    action: "message",
                    action_message: "You are online."
                })
            }

            if (st.category === "PNReconnectedCategory") {
                this.pubnub.publish(
                    {
                        message: {
                            
                        },
                        channel: "request_tracked",
                        sendByPost: false, // true to send via POST
                        storeInHistory: false //override default storage options
                    },
                    (status, response) => {
                        // handle status, response
                    }
                );

                this.setState({
                    action: "message",
                    action_message: "You are back online."
                })
            }

            if (st.category === "PNNetworkIssuesCategory") {
                this.setState({
                    action: "message",
                    action_message: "It appears there is a network issue."
                })
            }

            if (st.category === "PNNetworkDownCategory") {
                this.setState({
                    action: "message",
                    action_message: "It appears the network is down."
                })
            }

            if (st.category === "PNTimeoutCategory") {
                this.setState({
                    action: "message",
                    action_message: "Could not connect to the internet."
                })
            }
      },
      message: (message) => {
          
          if(message.channel === "users_monitored"){
                var tracked_user_id = this.state.tracked_users.find(id => id === message.message.user_id);

                if(!tracked_user_id){
                    this.setState(state => {
                        var tracked_users = state.tracked_users;

                        tracked_users.push(message.message.user_id);

                        persistence.saveTrackedUsers(tracked_users);

                        return {
                            tracked_users: tracked_users
                        }
                    })
                }
          }
         
          if(message.channel === "agent_tracked"){
                
                this.setState(state => {

                    var laser_agents = state.laser_agents;
                    var la = [];
                    
                    if(laser_agents.length > 0){
                        la = laser_agents.map(agen => {
                            if(agen.agent._id === message.message.agent.agent._id){
                                agen.is_on_route = true;
                                return agen;
                            }
                            else{
                                return agen;
                            }
                        });
                        
                    }
                    else{
                        //do nothing
                    }
                    console.log({la})
                    return {
                        laser_agents: la
                    }
                })

                
                    
                    /*var agents = state.selected_agents;
                    var laser_agents = state.laser_agents;

                    if(agents.length > 1){
                        this.state.selected_agents.map(age => 
                            {
                                var laser_agent = laser_agents.find(age => age.agent._id === message.channel);
                            
                                laser_agents.map(agen => {
                                    if(agen.agent._id === message.channel){
                                        var laser_agent = agen;

                                        if(laser_agent){
                                            message.message.agent.is_on_route = true;
        
                                            laser_agents.splice(agents.indexOf(laser_agent), 1, message.message.agent);
                                        }
                                    }
                                })

                                if(age!=null && (age.agent._id === message.message.agent._id)){
                                    agents.push(message.message.agent);

                                    persistence.saveSelectedAgents(agents);
                                }
                            }
                        );
                    }
                    else{
                        agents.push(message.message.agent);

                        laser_agents.map(age => {
                            if(age.agent._id === message.channel){
                                var laser_agent = age;

                                message.message.agent.is_on_route = true;

                                laser_agents.splice(agents.indexOf(laser_agent), 1, message.message.agent);

                                persistence.saveSelectedAgents(agents);
                            }
                        });
                    }
                    
                    return {  
                        selected_agents: agents,
                        laser_agents: laser_agents
                    }*/
          }
          
          if(message.channel === "agent_untracked"){
                this.setState(state => {
                    
                    var laser_agents = state.laser_agents;
                    var la = [];
                    
                    if(laser_agents.length > 0){
                        la = laser_agents.map(agen => {
                            if(agen.agent._id === message.message.agent.agent._id){
                                agen.is_on_route = false;
                                return agen;
                            }
                            else{
                                return agen;
                            }
                        });
                    }
                    else{
                        //do nothing
                    }

                    return {
                        laser_agents: la
                    }
                    
                    /*var laser_agents = state.laser_agents;
                    
                    if(agents.length > 1){
                        this.state.selected_agents.map(age => 
                            {
                                if(age!=null && (age.agent._id === message.channel)){
                                    agents.splice(agents.indexOf(message.message.agent),1);

                                    persistence.saveSelectedAgents(agents);
                                }
                            }
                        );
                    }
        
                    return {  
                        selected_agents: agents
                    }*/
                })
          }

          if(message.channel === "issue_resolved"){
                /*this.getLocationsDate(this.state.date);
                this.getEmergenciesDate(this.state.date);
    
                this.setState({
                    latest: []
                })
    
                this.getLatestLocations();
                this.getLatestEmergencies();*/
          }

          //We need a way to send the agents and users tracked to the other browsers
          if(message.channel === "request_tracked"){

                //splitting the publish into two so that the message wont be too heavy

                this.pubnub.publish(
                    {
                        message: {
                            agents: this.getSelectedAgentsIds()
                        },
                        channel: "response_tracked",
                        sendByPost: false, // true to send via POST
                        storeInHistory: false //override default storage options
                    },
                    (status, response) => {
                        // handle status, response
                    }
                );

                this.pubnub.publish(
                    {
                        message: {
                            users: this.state.tracked_users
                        },
                        channel: "response_tracked",
                        sendByPost: false, // true to send via POST
                        storeInHistory: false //override default storage options
                    },
                    (status, response) => {
                        // handle status, response
                    }
                );
          }

          if(message.channel === "response_tracked"){
              if(message.message.agents){
                  if(message.message.agents.length > 0){
                    this.setSelectedAgentsFromIds(message.message.agents);
                  }
              }

              if(message.message.users){
                  if(message.message.users.length > 0){
                        this.setState(state => {
                            var tracked_users = state.tracked_users;
    
                            message.message.users.map(user_id => {
                                var found = tracked_users.find(id => id === user_id)

                                if(!found){
                                    tracked_users.push(user_id)
                                }
                            })

                            persistence.saveTrackedUsers(tracked_users);
    
                            return{
                                tracked_users: tracked_users
                            }
                        })
                  }
              }
          }
          
          var tracked_user_id = this.state.tracked_users.find(id => id === message.channel);

          if(tracked_user_id){
                //the message is from a user currently being monitored
                if(message.userMetadata && message.userMetadata.action === "user_location_update"){
                    var arr = this.state.emergencies.map(emergency => {
                        if(emergency.user === tracked_user_id){
                            emergency.latitude = message.message.latitude;
                            emergency.longitude = message.message.longitude;
                            return emergency;
                        }
                        else{
                            return emergency;
                        }
                    })

                    //var found_emergency = state.emergencies.find(emergency => emergency.user === state.tracked_user_id);

                    this.setState(state => {
                        return{
                            emergencies: arr
                        }
                    })
                }
          }
          
          if(message.channel === this.state.tracked_area ){
              console.log(message.message);
              if(message.userMetadata && message.userMetadata.action === "agent_location_update"){
                  var agents = this.state.laser_agents;
                
                  var found_agent;

                  this.state.laser_agents.map(agent => {    
                      if(agent.agent._id === message.message.agent._id){
                          found_agent = agent;
                      }
                  })

                  if(found_agent){
                        this.state.laser_agents.map(agent => {
                            if(agent.agent._id === message.message.agent._id){
                                    found_agent = agent;

                                    if(this.state.laser_agents.length<=0||!found_agent){
                                        agents.push(message.message);
                                    }
                                    else{
                                        agents = this.state.laser_agents.map(agent => {
                                            
                                            if(agent.agent._id === message.message.agent._id){
                                                
                                                if(this.state.selected_agents.length>0){
                                                    var found_agent_on_route_possibly;

                                                    this.state.selected_agents.forEach((age,index) => {
                                                        if(age){
                                                            if(age.agent._id === message.message.agent._id){
                                                                found_agent_on_route_possibly = age;
                                                            }
                                                        }
                                                    });
                                                
                                                    if(found_agent_on_route_possibly){
                                                        message.message.is_on_route = found_agent_on_route_possibly.is_on_route;
                                                    }
                                                    else{
                                                        message.message.is_on_route = false;
                                                    }
                                                }
                                                else{
                                                    message.message.is_on_route = false;
                                                }

                                                return message.message;
                                            }
                                            else{
                                                if(this.state.selected_agents.length>0){
                                                    var found_agent_on_route_possibly;

                                                    this.state.selected_agents.forEach((age,index) => {
                                                        if(age){
                                                            if(age.agent._id === message.message.agent._id){
                                                                found_agent_on_route_possibly = age;
                                                            }
                                                        }
                                                    });
                                                
                                                    if(found_agent_on_route_possibly){
                                                        agent.is_on_route = found_agent_on_route_possibly.is_on_route;
                                                    }
                                                    else{
                                                        agent.is_on_route = false;
                                                    }
                                                }
                                                else{
                                                    agent.is_on_route = false;
                                                }

                                                return agent;
                                            }
                                        });
                                    }
                            }
                        })
                  }
                  else{
                      agents.push(message.message);
                  }
                  
                  this.setState(state => {
                      return {
                            laser_agents: agents
                      }
                  })
                  
              }
          }
          
          //Check if its an agent that is replying to a request, could also be used in future to check for other messages from the selected agents
          if(this.state.selected_agents.length > 0){
              
              this.state.selected_agents.forEach((agent,index) => {
                  
                  if(agent!==null && (agent.agent._id === message.channel)){
                      
                      if(message.userMetadata && message.userMetadata.action === "route_request_response"){
                          if(message.message.response===true){

                              this.setState(state => {
                                  var agents = state.selected_agents;

                                  console.log({agents});

                                  agents[index].is_on_route = true;
                                  
                                  console.log({agents});

                                  persistence.saveSelectedAgents(agents);

                                  return {
                                        selected_agents: agents,
                                        action: "message",
                                        action_message: "Agent " +agent.agent.firstname +" " +agent.agent.lastname +" is now en route to "+this.state.clicked_user.full_name+"'s location"
                                  }
                              })

                          }
                          else{
                              this.setState(state => {
                                var agents = state.selected_agents;

                                agents[index].is_on_route = false;
                                
                                persistence.saveSelectedAgents(agents);

                                return {
                                    selected_agents: agents,
                                    action: "message",
                                    action_message: "Agent " +agent.agent.firstname +" " +agent.agent.lastname +" declined the request to go to "+this.state.clicked_user.full_name+"'s location"
                                }
                              })
                          }
                      }
                      
                      if(message.userMetadata && message.userMetadata.action === "route_completed"){
                          //show message that agent has completed route
                          if(message.message){
                              this.setState(state => {
                                  var array = state.route_responses_from_agents;

                                  var user = message.message;

                                  array.push({user:user, agent:agent})

                                  return {
                                      route_responses_from_agents : array
                                  }
                              })
                          }
                      }
                  }
              })
          }

      }
    });

    const socket = socketIOClient(socket_io_url);

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
             this.setState(state => {
              let arr = state.emergencies;
              let lat = state.latest;
              
              lat.push(data);
              arr.push(data)

              return {
                  play_sound: true,
                  latest: lat,
                  clicked_marker_id: data._id,
                  zoom: 18,
                  emergencies: arr,
                  center: {
                    lat: data.latitude,
                    lng: data.longitude
                 }
              }
            })
         }
      }
    );

    socket.on("call", 
      data => {
        if(data){
            this.setState(state => {
              let arr = state.locations;
              let lat = state.latest;
              
              lat.push(data);
              arr.push(data)

              return {
                  play_sound: true,
                  latest: lat,
                  clicked_marker_id: data._id,
                  zoom: 18,
                  locations: arr,
                  center: {
                    lat: data.latitude,
                    lng: data.longitude
                 }
              }
          })
        }
      }
    );

    this.getLocations();
    this.getEmergencies();
  }

  async getLocationsDate(date){
        const response = await API.getLocations({date})
        
        if(response=="error"){
            this.setState({
                action: "err_calls_load",
                locations: [],
                filtered_locations: []
            })

            return;
        }

        if(response&&response.data&&response.data.locations){
            console.log({response})
            if(this.state.action === "loading"){
                this.setState({
                    action: "close",
                    locations: response.data.locations,
                    filtered_locations: response.data.locations
                })
            }
            else{
                this.setState({
                    locations: response.data.locations,
                    filtered_locations: response.data.locations
                })
            }
        }
        else{
            this.setState({
                action: "close",
                locations: [],
                filtered_locations: []
            })
        }
  }

  async getEmergenciesDate(date){
        const response = await API.getEmergencies({date})
        
        if(response=="error"){
            this.setState({
                action: "err_emergency_load",
                emergencies: [],
                filtered_emergencies: []
            })
            return;
        }

        if(response&&response.data&&response.data.emergencies){
            console.log({response})
            if(this.state.action === "loading"){
                this.setState({
                    action: "close",
                    emergencies: response.data.emergencies,
                    filtered_emergencies: response.data.emergencies
                })
            }
            else{
                this.setState({
                    emergencies: response.data.emergencies,
                    filtered_emergencies: response.data.emergencies
                })
            }
        }
        else{
            this.setState({
                action: "close",
                emergencies: [],
                filtered_emergencies: []
            })
        }
  }

  async getLatestLocations(){
        var self = this;
        const response = await API.getLocations({date: today})

        if(response=="error"){
            return;
        }

        if(response&&response.data&&response.data.locations&&response.data.locations.length>0){
            self.setState(state => {
                var loc = state.latest;

                for(var i = 0; i<response.data.locations.length; i++){
                    loc.push(response.data.locations[i]);
                }

                loc = utils.sortDates(loc);

                return {
                    latest : loc
                }
                
            })
        }
  }

  async getLatestEmergencies(){
        var self = this;
        const response = await API.getEmergencies({date: today})

        if(response=="error"){
            return;
        }

        if(response&&response.data&&response.data.emergencies&&response.data.emergencies.length>0){
            self.setState(state => {
                var loc = state.latest;

                for(var i = 0; i<response.data.emergencies.length; i++){
                    loc.push(response.data.emergencies[i]);
                }

                loc = utils.sortDates(loc);

                return {
                    latest : loc
                }
            })
        }
  }

  async getEmergencies(){
        const response = await API.getEmergencies({date: today})

        if(response=="error"){
            //show error message
            this.setState({
                action: "err_emergency_load",
                emergencies: [],
                filtered_emergencies: []
            })
            return;
        }

        if(response&&response.data&&response.data.emergencies&&response.data.emergencies.length>0){
            this.setState(state => {
            var loc = state.latest;

            for(var i = 0; i<response.data.emergencies.length; i++){
                loc.push(response.data.emergencies[i]);
            }

            loc = utils.sortDates(loc);

            if(this.state.action === "loading"){
                return {
                    action: "close",
                    latest : loc,
                    emergencies: response.data.emergencies,
                    filtered_emergencies: response.data.emergencies
                }
            }
            else{
                return {
                    latest : loc,
                    emergencies: response.data.emergencies,
                    filtered_emergencies: response.data.emergencies
                }
            }
            })
        }
        else{
            this.setState({
                action: "close",
                emergencies: [],
                filtered_emergencies: []
            })
        }
  }

  async getLocations(){

        const response = await API.getLocations({date: today})

        if(response=="error"){
            //show error message
            this.setState({
                action: "err_calls_load",
                locations: [],
                filtered_locations: []
            })
            return;
        }

        if(response&&response.data&&response.data.locations&&response.data.locations.length>0){
            this.setState(state => {
                var loc = state.latest;

                for(var i = 0; i<response.data.locations.length; i++){
                    loc.push(response.data.locations[i]);
                }

                loc = utils.sortDates(loc);

                if(this.state.action === "loading"){
                    return {
                        action: "close",
                        latest : loc,
                        locations: response.data.locations,
                        filtered_locations: response.data.locations
                    }
                }
                else{
                    return {
                        latest : loc,
                        locations: response.data.locations,
                        filtered_locations: response.data.locations
                    }
                }
            })
        }
        else{
            this.setState({
                action: "close",
                locations: [],
                filtered_locations: []
            })
        }
  }

  handleSongFinishedPlaying(){
      this.setState({
          play_sound: false
      })
 }


render(){
    let sound;

    if(this.state.play_sound){
       sound = <Sound
       url={alert}
       playStatus={Sound.status.PLAYING}
       playFromPosition={1 /* in milliseconds */}
       onLoading={this.handleSongLoading}
       onPlaying={this.handleSongPlaying}
       onFinishedPlaying={this.handleSongFinishedPlaying}/>;
    }
    else{
      sound = "";
    }

    let show_location_side_bar;
    
    if(this.state.location_side_bar_open){
      show_location_side_bar = <LocationSidebar closeSidebar={this.closeSideBar} location={this.state.clicked_user} resolve={this.showConfirmResolveLocation} />
    }
    else{
      show_location_side_bar = "";
    }

    let show_side_bar;
    
    if(this.state.side_bar_open){
      show_side_bar = <Sidebar closeSidebar={this.closeSideBar} emergency={this.state.clicked_user} startMonitoring={this.startMonitoring} resolve={this.showConfirmResolveEmergency} />
    }
    else{
      show_side_bar = "";
    }

    return (
        <div className="laser-parent-div" style={mapStyle}>
            <Latest latest={this.state.latest} latestClicked={this.latestClicked}/>
            {show_location_side_bar}
            {show_side_bar}
            {this.state.agent_side_bar_open ? <AgentDetails removeAgentFromRoute={this.removeAgentFromRoute} closeAgentSideBar={this.closeAgentSideBar} addAgentToMonitoring={this.addAgentToMonitoring} agent={this.state.clicked_agent} user={this.state.clicked_user}/> : "" }

            <TopPanel logout={this.logout} onCalendarOpen={this.onCalendarOpen} onDateChange={this.onDateChange} date={this.state.date} selected_call={this.state.selected_call} 
            onCallsChanged={this.onCallsChanged} selected_emergency={this.state.selected_emergency} onEmergenciesChanged={this.onEmergenciesChanged} getAllAgentsLocation={this.subscribeAndGetAllAgentsLocation}/>

            {sound}
            <Map google={this.props.google} 
                style={mapStyle}
                onReady={this.fetchPlaces}
                initialCenter={this.state.center}
                center={this.state.center}
                zoom={this.state.zoom}>
        
                {this.getLocationsMarkers()}
                {this.getEmergenciesMarkers()}
                {this.getAgentMarkers()}

            </Map>

            <Action action={this.state.action} closeAction={this.closeAction} message={this.state.action_message}/>

            {
                this.state.route_responses_from_agents.length > 0 ?  <RouteStatus route_response={this.state.route_responses_from_agents[this.state.route_responses_from_agents.length - 1]} removeAgentFromRouteAndCloseRouteResponse={this.removeAgentFromRouteAndCloseRouteResponse} closeRouteResponse={this.closeRouteResponse} /> : ""
            }

            {
                this.state.showConfirm.status===true ? <ConfirmAction  yesClicked={this.state.showConfirm.action==="emergency" ? this.resolveEmergency : this.resolveCall} noClicked={this.hideConfirm} message={this.state.message} /> : ""
            }
        </div>
    );
  }

}

export default GoogleApiWrapper({
    apiKey: ('AIzaSyADNxHcgsHDyx_OSbqxBg5xB5lV2YJDcKI')
})(App)
