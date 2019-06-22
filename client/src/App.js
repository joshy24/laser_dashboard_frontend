import React, {Component} from 'react';
import logo from './logo.svg';
import red_circle from './emergency_with_circle.png';
import blue_circle from './call_with_circle.png';
import emergency_icon from './emergency.png';
import call_icon from './call.png';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import socketIOClient from "socket.io-client";
import Sidebar from './components/Sidebar';
import LocationSidebar from './components/LocationSideBar';
import Latest from './components/Latest';

import DatePicker from 'react-date-picker';

import './App.css';

import axios from 'axios';

const mapStyle = {
  height: '100vh', 
  width: '100%'
}

const dateStyle = {
   color: "#111111",
   border: "1px solid #FFFFFF",
   zIndex: "6000",
   marginLeft:"8px",
   marginRight: "8px",
   padding: "8px"
}

const controls_style = {
  marginLeft:"8px",
  marginRight: "8px"
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

      date: new Date()
     }
     
     this.closeSideBar = this.closeSideBar.bind(this);
     this.onCallsChanged = this.onCallsChanged.bind(this);
     this.onEmergenciesChanged = this.onEmergenciesChanged.bind(this);
     this.onDateChange = this.onDateChange.bind(this);
     this.onCalendarOpen = this.onCalendarOpen.bind(this);
     this.latestClicked = this.latestClicked.bind(this);

     var year = today.split(/T(.+)/)[0];

     year = year+"T00:00:00.000Z";

     today = new Date(year);
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
        side_bar_open: false, 
        location_side_bar_open: false
      })
  }

  onDateChange(d){
     this.setState({
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
              filtered_locations: state.locations,
              side_bar_open: false, 
              location_side_bar_open: false,
              show_blue_circle: false
            }))
          }
          else if(value==="None"){
            this.setState({
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
                filtered_locations: arr,
                side_bar_open: false, 
                location_side_bar_open: false,
                show_blue_circle: false
              })
            }
            else{
              //show message that there are no locations found for that parameter
      
              this.setState({
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
              filtered_emergencies: state.emergencies,
              side_bar_open: false, 
              location_side_bar_open: false,
              show_red_circle: false
            }))
          }
          else if(value==="None"){
            this.setState({
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
                filtered_emergencies:arr,
                side_bar_open: false, 
                location_side_bar_open: false,
                show_red_circle: false
              })
            }
            else{
              //show message that there are no emregencies found for that parameter
      
              this.setState({
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

  closeSideBar(e){
    this.setState({
       side_bar_open: false,
       location_side_bar_open: false,
       selected_location: {},
       selected_emergency: {},
       clicked_marker_id: ""
    })
  }

  fetchPlaces(mapProps, map) {
    
  }

  componentDidMount(){

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

    instance.post(emergencies_url,{date: today})
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

  render(){

    let show_location_side_bar;
    
    if(this.state.location_side_bar_open){
      show_location_side_bar = <LocationSidebar closeSidebar={this.closeSideBar} location={this.state.selected_location}/>
    }
    else{
      show_location_side_bar = "";
    }

    let show_side_bar;
    
    if(this.state.side_bar_open){
      show_side_bar = <Sidebar closeSidebar={this.closeSideBar} emergency={this.state.selected_emergency}/>
    }
    else{
      show_side_bar = "";
    }

    return (
      <div className="laser-parent-div" style={mapStyle}>
          <Latest latest={this.state.latest} latestClicked={this.latestClicked}/>
          {show_location_side_bar}
          {show_side_bar}
          <div className="laser-top-panel">
             <h4 className="laser-inline">Laser Emergency Admin Platform</h4>
             <div className="laser-controls laser-inline">
                
                <div className="laser-inline" style={dateStyle}>
                  <DatePicker
                    onCalendarOpen={this.onCalendarOpen}
                    maxDate={new Date()}
                    style={dateStyle}
                    onChange={this.onDateChange}
                    value={this.state.date}/>
                </div>  

                <select style={controls_style} className="form-control laser-inline laser-150-width" id="calls" name="calls" value={this.selected_call} onChange={this.onCallsChanged}>
                    <option>Calls (All)</option>
                    <option>Emergency Management(LASEMA)</option>
                    <option>Police</option>
                    <option>Distress</option>
                    <option>Environmental and Special Offences Task Force</option>
                    <option>Fire / Safety Services</option>
                    <option>Environmental / Noise Pollution</option>
                    <option>Broken Pipe / Water Leakage</option>
                    <option>Pothole / Collapsed Road</option>
                    <option>None</option>
                </select>
                
                <select style={controls_style} className="form-control laser-inline laser-150-width" id="emergencies" name="emergencies" value={this.selected_call} onChange={this.onEmergenciesChanged}>
                    <option>Emergencies (All)</option>
                    <option>Police Cases</option>
                    <option>Hospital Cases</option>
                    <option>Fire Cases</option>
                    <option>None</option>
                </select>
                
             </div>
          </div>
          <Map google={this.props.google} 
              style={mapStyle}
              onReady={this.fetchPlaces}
              initialCenter={this.state.center}
              center={this.state.center}
              zoom={this.state.zoom}>
    
            {this.getLocationsMarkers()}
            {this.getEmergenciesMarkers()}

          </Map>
      </div>
    );
  }

}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyADNxHcgsHDyx_OSbqxBg5xB5lV2YJDcKI')
})(App)
