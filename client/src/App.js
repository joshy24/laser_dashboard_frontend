import React, {Component} from 'react';
import logo from './logo.svg';
import emergency_icon from './emergency.png'
import call_icon from './call.png'
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import Sidebar from './components/Sidebar';
import './App.css';

import axios from 'axios';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const mapStyle = {
  height: '100vh', 
  width: '100%'
}

const instance = axios.create({
  baseURL: 'http://localhost:3077',
  timeout: 5000,
  headers: {'Accept': 'application/json;q=0.9,*/*;q=0.8'}
});

const locations_url = "/api/getLocations";
const emergencies_url = "/api/getEmergencies";

class App extends Component{

  constructor(props){
     super(props);

     this.state = {locations: [], emergencies: [], side_bar_open: false, selected_emergency: {}, center: {lat: 6.5244,lng: 3.3792}}
     this.closeSideBar = this.closeSideBar.bind(this);
  }

  onLocationClicked(location,e){
     
  }

  onEmergencyClicked(emergency,e){
    this.setState({
       selected_emergency: emergency,
       side_bar_open: true,
       center: {
          lat: emergency.latitude, lng: emergency.longitude
       }
    })
 }

  getLocationsMarkers(){
    
    let locations_ui;

    if(this.state.locations.length>0){
        locations_ui = this.state.locations.map(loc => {
          return  <Marker key={loc._id} onClick={e => this.onLocationClicked(loc,e)}
                    name={loc.reason} 
                    position={{lat: loc.latitude, lng: loc.longitude}}
                    icon={{
                      url: call_icon
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

    if(this.state.emergencies.length>0){
      emergencies_ui = this.state.emergencies.map(emer => {
          return <Marker key={emer._id} onClick={e => this.onEmergencyClicked(emer,e)}
                    name={emer.reasons[0]} 
                    position={{lat: emer.latitude, lng: emer.longitude}}
                    icon={{
                      url: emergency_icon
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
       selected_emergency: {}
    })
  }

  fetchPlaces(mapProps, map) {
    
  }

  componentDidMount(){
    instance.post(locations_url,{})
        .then(response => {
          console.log(response);
            if(response&&response.data&&response.data.locations){
               this.setState({
                  locations: response.data.locations
               })
            }
        })
        .catch(error => {
            console.log({error})
        })

    instance.post(emergencies_url,{})
        .then(response => {
          console.log(response);
            if(response&&response.data&&response.data.emergencies){
               this.setState({
                  emergencies: response.data.emergencies
               })
            }
        })
        .catch(error => {
          console.log({error})
        })
  }

  render(){

    let show_side_bar;
    
    if(this.state.side_bar_open){
      show_side_bar = <Sidebar closeSidebar={this.closeSideBar} emergency={this.state.selected_emergency}/>
    }
    else{
      show_side_bar = "";
    }

    return (
      <div style={mapStyle}>
          {show_side_bar}
          <div className="laser-top-panel">
             <h4>Laser Emergency Admin Platform</h4>
          </div>
          <Map google={this.props.google} 
              style={mapStyle}
              onReady={this.fetchPlaces}
              initialCenter={this.state.center}
              center={this.state.center}
              zoom={11}>
    
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
