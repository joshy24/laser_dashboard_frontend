import React, {Component} from 'react';
import logo from './logo.svg';
import red_circle from './emergency_with_circle.png';
import blue_circle from './call_with_circle.png';
import emergency_icon from './emergency.png';
import call_icon from './call.png';
import police_car_icon from './police_car.png';
import alert from "./sounds/alert.mp3";
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import socketIOClient from "socket.io-client";
import Sidebar from './components/Sidebar';
import LocationSidebar from './components/LocationSideBar';
import TopPanel from './components/TopPanel';
import Latest from './components/Latest';
import Utils from './utils/Utils';
import Sound from 'react-sound';
import PubNubReact from 'pubnub-react';

import './App.css';

import axios from 'axios';

const utils = new Utils();

const mapStyle = {
  height: '100vh', 
  width: '100%'
}

const socket_io_url = 'http://18.195.71.164';
//const socket_io_url = 'http://localhost:3077';

let today = new Date().toISOString();

const instance = axios.create({
  baseURL: 'http://18.195.71.164',
  //baseURL: 'http://localhost:3077',
  timeout: 15000,
  headers: {'Accept': 'application/json;q=0.9,*/*;q=0.8'}
});

const locations_url = "/api/getLocations";
const emergencies_url = "/api/getEmergencies";

class App extends Component{

  constructor(props){
     super(props);

     this.state = {
        latest: [],
        locations: [], 
        emergencies: [], 
        filtered_locations: [],
        filtered_emergencies: [],
        side_bar_open: false, 
        location_side_bar_open: false, 
        selected_emergency: {}, 
        center: {lat: 6.5244,lng: 3.3792}, 
        selected_call:"Calls (All)", 
        selected_emergency:"Emergencies (All)",
        zoom : 11,
        show_red_circle: false,
        show_blue_circle: false,
        clicked_marker_id: "",
        play_sound: false,
        channels_list: [],
        laser_agents:[],
        tracked_user_id: "",
        tracked_area: "", //the user in which the admin is currently viewing whether the user wants to be tracked or not
        date: new Date()
     }
     
     this.pubnub = new PubNubReact({
      publishKey: 'pub-c-100b3918-0e25-4fac-ade6-c58d013cd019',
      subscribeKey: 'sub-c-21e1e450-9457-11e9-bf84-1623aee89087'
     });
     this.pubnub.init(this);

     this.closeSideBar = this.closeSideBar.bind(this);
     this.onCallsChanged = this.onCallsChanged.bind(this);
     this.onEmergenciesChanged = this.onEmergenciesChanged.bind(this);
     this.onDateChange = this.onDateChange.bind(this);
     this.onCalendarOpen = this.onCalendarOpen.bind(this);
     this.latestClicked = this.latestClicked.bind(this);
     this.startMonitoring = this.startMonitoring.bind(this);
  
     var year = today.split(/T(.+)/)[0];

     year = year+"T00:00:00.000Z";

     today = new Date(year);
  }

  //Subscribe to the users sub admin area to receive updates and send out a request to all agents on the channel to send their location 
  //just in case some of them are not moving at the momemnt and their location is not updating
  startMonitoring(item){
      if(item.sub_admin_address){
        
        this.pubnub.publish(
          {
              message: {
                  action: "send_location"
              },
              channel: item.sub_admin_address,
              sendByPost: false, // true to send via POST
              storeInHistory: false //override default storage options
          },
          (status, response) => {
              // handle status, response
          }
        );

        //Next we will subscribe to the area to get latest updates
        this.setState(state => {
            var list = state.channels_list;

            if(list.indexOf(item.user)==-1){

              //remove old user from list
              //unsubscribe from old user
    
              list.push(item.user)
            }

            if(list.indexOf(item.sub_admin_address)==-1){
              list.push(item.sub_admin_address)
            }

            this.pubnub.subscribe({
              channels: list
            })

            return {
                channels_list: list,
                tracked_user_id: item.user,
                tracked_area: item.sub_admin_address,
                laser_agents: []
            }
        })
      }
      else{
        //a requeest is made to find out what area the user is in and then use that to find the agents locations
      }
  }

  latestClicked(item){
    switch(item.laser_type){
      case "emergency":
        this.setState({
          selected_emergency: item,
          side_bar_open: true,
          location_side_bar_open: false,
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
            selected_location: item,
            side_bar_open: false,
            location_side_bar_open: true,
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
        location_side_bar_open: false
      })
  }

  onDateChange(d){
     this.setState({
        play_sound: false,
        date: d,
        show_red_circle: false,
        show_blue_circle: false,
        clicked_marker_id: "",
        selected_call:"Calls (All)", 
        selected_emergency:"Emergencies (All)"
     })

     instance.post(locations_url,{date:d})
        .then(response => {
            if(response&&response.data&&response.data.locations){
              this.setState({
                locations: response.data.locations,
                filtered_locations: response.data.locations
              })
            }
            else{
              this.setState({
                locations: [],
                filtered_locations: []
              })
            }
        })
        .catch(error => {
            console.log({error})
        })

    instance.post(emergencies_url,{date:d})
        .then(response => {
            if(response&&response.data&&response.data.emergencies){
               this.setState({
                  emergencies: response.data.emergencies,
                  filtered_emergencies: response.data.emergencies
               })
            }
            else{
              this.setState({
                emergencies: [],
                filtered_emergencies: []
             })
            }
        })
        .catch(error => {
          console.log({error})
        })

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
              location_side_bar_open: false,
              show_blue_circle: false
            }))
          }
          else if(value==="None"){
            this.setState({
              play_sound: false,
              filtered_locations: [],
              side_bar_open: false, 
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
                side_bar_open: false, 
                location_side_bar_open: false,
                show_blue_circle: false
              })
            }
            else{
              //show message that there are no locations found for that parameter
      
              this.setState({
                  play_sound: false,
                  filtered_locations:[],
                  selected_call:"Calls (All)",
                  side_bar_open: false, 
                  location_side_bar_open: false,
                  show_blue_circle: false
              })
            }
          }
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
              location_side_bar_open: false,
              show_red_circle: false
            }))
          }
          else if(value==="None"){
            this.setState({
              play_sound: false,
              filtered_emergencies:[],
              side_bar_open: false, 
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
                side_bar_open: false, 
                location_side_bar_open: false,
                show_red_circle: false
              })
            }
            else{
              //show message that there are no emregencies found for that parameter
      
              this.setState({
                  play_sound: false,
                  filtered_emergencies: [],
                  selected_emergency:"Emergencies (All)",
                  side_bar_open: false, 
                  location_side_bar_open: false,
                  show_red_circle: false
              })
            }
          }
      }    
  }

  onLocationClicked(location,e){
    this.setState({
      play_sound: false,
      selected_location: location,
      side_bar_open: false,
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
       selected_emergency: emergency,
       side_bar_open: true,
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
          return <Marker key={i} 
                    name={agent.full_address} 
                    title={agent.full_address}
                    position={{lat: agent.latitude, lng: agent.longitude}}
                    icon={{
                      url: police_car_icon
                    }}/>
        })
      }
      else{
        agents_ui = "";
      }

      return agents_ui;
  }

  closeSideBar(e){
    this.setState({
       play_sound: false,
       side_bar_open: false,
       location_side_bar_open: false,
       selected_location: {},
       selected_emergency: {},
       clicked_marker_id: ""
    })
  }

  fetchPlaces(mapProps, map) {
    
  }

  componentWillUnmount() {
    this.pubnub.unsubscribe({
        channels: this.state.channels_list
    });
  }

  componentDidMount(){

    this.pubnub.addListener({
      status: (st) => {
          console.log({st});
      },
      message: (message) => {
          this.setState(state => {
            var agents = state.laser_agents;
            var channels = state

            agents.push(message.message);

            return{
               laser_agents: agents
            }
          })
      }
    });

    const socket = socketIOClient(socket_io_url);

    socket.on("connect", 
      () => console.log("connected to socket io")
    );
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

    instance.post(locations_url,{date: today})
        .then(response => {
            if(response&&response.data&&response.data.locations&&response.data.locations.length>0){
              this.setState(state => {
                  var loc = state.latest;

                  for(var i = 0; i<response.data.locations.length; i++){
                      loc.push(response.data.locations[i]);
                  }

                  loc = utils.sortDates(loc);

                  return {
                    latest : loc,
                    locations: response.data.locations,
                    filtered_locations: response.data.locations
                  }
              })
            }
            else{
              this.setState({
                locations: [],
                filtered_locations: []
              })
            }
        })
        .catch(error => {
            console.log({error})
        })

    instance.post(emergencies_url,{date: today})
        .then(response => {
            if(response&&response.data&&response.data.emergencies&&response.data.emergencies.length>0){
               this.setState(state => {
                  var loc = state.latest;

                  for(var i = 0; i<response.data.emergencies.length; i++){
                      loc.push(response.data.emergencies[i]);
                  }

                  loc = utils.sortDates(loc);

                  return {
                      latest : loc,
                      emergencies: response.data.emergencies,
                      filtered_emergencies: response.data.emergencies
                  }
               })
            }
            else{
              this.setState({
                emergencies: [],
                filtered_emergencies: []
             })
            }
        })
        .catch(error => {
          console.log({error})
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
      show_location_side_bar = <LocationSidebar closeSidebar={this.closeSideBar} location={this.state.selected_location}/>
    }
    else{
      show_location_side_bar = "";
    }

    let show_side_bar;
    
    if(this.state.side_bar_open){
      show_side_bar = <Sidebar closeSidebar={this.closeSideBar} emergency={this.state.selected_emergency} startMonitoring={this.startMonitoring}/>
    }
    else{
      show_side_bar = "";
    }

    return (
      <div className="laser-parent-div" style={mapStyle}>
          <Latest latest={this.state.latest} latestClicked={this.latestClicked}/>
          {show_location_side_bar}
          {show_side_bar}

          <TopPanel onCalendarOpen={this.onCalendarOpen} onDateChange={this.onDateChange} date={this.state.date} selected_call={this.state.selected_call} 
          onCallsChanged={this.onCallsChanged} selected_emergency={this.state.selected_emergency} onEmergenciesChanged={this.onEmergenciesChanged}/>

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
      </div>
    );
  }

}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyADNxHcgsHDyx_OSbqxBg5xB5lV2YJDcKI')
})(App)
