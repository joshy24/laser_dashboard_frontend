(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{132:function(e,t){},164:function(e,t,n){},183:function(e,t,n){"use strict";n.r(t);var a=n(0),l=n.n(a),r=n(14),c=n.n(r),i=n(81),o=n(9),s=n(11),m=n(71),d=n(72),u=n(84),_=n(73),g=n(10),h=n(85),p=(n(91),n(74)),b=n.n(p),E=n(75),f=n.n(E),y=n(76),k=n.n(y),v=n(77),C=n.n(v),w=n(20),S=n(78),A=n.n(S);function O(e){return l.a.createElement("div",{className:"laser-side-bar"},l.a.createElement("h1",{className:"close_btn",onClick:function(t){return e.closeSidebar(t)}},"\u2715"),l.a.createElement("br",null),l.a.createElement("h4",{className:"text-center laser-red-text"},l.a.createElement("b",null,"Emergency Location Details")),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Persons Name")," - ",e.emergency.full_name),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Person's Emergency Contacts")," - ",e.emergency.emergency_numbers&&e.emergency.emergency_numbers.length>0?e.emergency.emergency_numbers.map(function(e,t){return l.a.createElement("p",{key:t},e)}):""),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Email Address")," - ",e.emergency.email?e.emergency.email:""),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Phone Number")," - ",e.emergency.phone_number?e.emergency.phone_number:""),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Device")," - ",e.emergency.device?e.emergency.device:""),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Emergency Full Address")," - ",e.emergency.full_address?e.emergency.full_address:""),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Emergency Admin Address")," - ",e.emergency.sub_admin_address?e.emergency.sub_admin_address:""),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Reason For Emergency")," - ",e.emergency.reasons?function(e){switch(e.length){case 0:return"";case 1:return e[0]+" issue";case 2:return e[0]+" issue, "+e[1]+" issue";case 3:return e[0]+" issue, "+e[1]+" issue, "+e[2]+" issue"}}(e.emergency.reasons):""))}function x(e){return l.a.createElement("div",{className:"laser-side-bar"},l.a.createElement("h1",{className:"close_btn",onClick:function(t){return e.closeSidebar(t)}},"\u2715"),l.a.createElement("br",null),l.a.createElement("h4",{className:"text-center laser-blue-text"},l.a.createElement("b",null,"Call Location Details")),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Persons Name")," - ",e.location.full_name),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Email Address")," - ",e.location.email?e.location.email:""),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Phone Number")," - ",e.location.phone_number?e.location.phone_number:""),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Call Full Address")," - ",e.location.full_address?e.location.full_address:""),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Call Admin Address")," - ",e.location.sub_admin_address?e.location.sub_admin_address:""),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Reason For Call")," - ",e.location.reason?e.location.reason:""))}var N=n(79),j=n.n(N),D=(n(164),n(80)),L=n.n(D),F={height:"100vh",width:"100%"},P={color:"#111111",border:"1px solid #FFFFFF",zIndex:"6000",marginLeft:"8px",marginRight:"8px",padding:"8px"},B={marginLeft:"8px",marginRight:"8px"},M=(new Date).toISOString(),z=L.a.create({baseURL:"http://18.195.71.164",timeout:15e3,headers:{Accept:"application/json;q=0.9,*/*;q=0.8"}}),R=function(e){function t(e){var n,a;Object(m.a)(this,t),(a=Object(u.a)(this,Object(_.a)(t).call(this,e))).state=(n={locations:[],emergencies:[],filtered_locations:[],filtered_emergencies:[],side_bar_open:!1,location_side_bar_open:!1,selected_emergency:{},center:{lat:6.5244,lng:3.3792},selected_call:"Calls (All)"},Object(s.a)(n,"selected_emergency","Emergencies (All)"),Object(s.a)(n,"zoom",11),Object(s.a)(n,"show_red_circle",!1),Object(s.a)(n,"show_blue_circle",!1),Object(s.a)(n,"clicked_marker_id",""),Object(s.a)(n,"date",new Date),n),a.closeSideBar=a.closeSideBar.bind(Object(g.a)(a)),a.onCallsChanged=a.onCallsChanged.bind(Object(g.a)(a)),a.onEmergenciesChanged=a.onEmergenciesChanged.bind(Object(g.a)(a)),a.onDateChange=a.onDateChange.bind(Object(g.a)(a)),a.onCalendarOpen=a.onCalendarOpen.bind(Object(g.a)(a));var l=M.split(/T(.+)/)[0];return l+="T00:00:00.000Z",M=new Date(l),a}return Object(h.a)(t,e),Object(d.a)(t,[{key:"onCalendarOpen",value:function(){this.setState({side_bar_open:!1,location_side_bar_open:!1})}},{key:"onDateChange",value:function(e){var t=this;this.setState({date:e,show_red_circle:!1,show_blue_circle:!1,clicked_marker_id:"",selected_call:"Calls (All)",selected_emergency:"Emergencies (All)"}),z.post("/api/getLocations",{date:e}).then(function(e){e&&e.data&&e.data.locations?t.setState({locations:e.data.locations,filtered_locations:e.data.locations}):t.setState({locations:[],filtered_locations:[]})}).catch(function(e){console.log({error:e})}),z.post("/api/getEmergencies",{date:e}).then(function(e){e&&e.data&&e.data.emergencies?t.setState({emergencies:e.data.emergencies,filtered_emergencies:e.data.emergencies}):t.setState({emergencies:[],filtered_emergencies:[]})}).catch(function(e){console.log({error:e})})}},{key:"onCallsChanged",value:function(e){var t=e.target,n=t.value,a=(t.name,[]);this.state.locations.length>0&&("Calls (All)"===n?this.setState(function(e){return{filtered_locations:e.locations,side_bar_open:!1,location_side_bar_open:!1,show_blue_circle:!1}}):"None"===n?this.setState({filtered_locations:[],side_bar_open:!1,location_side_bar_open:!1,show_blue_circle:!1}):(this.state.locations.map(function(e){e.reason.includes(n.toLowerCase())&&a.push(e)}),a.length>0?this.setState({filtered_locations:a,side_bar_open:!1,location_side_bar_open:!1,show_blue_circle:!1}):this.setState({filtered_locations:[],selected_call:"Calls (All)",side_bar_open:!1,location_side_bar_open:!1,show_blue_circle:!1})))}},{key:"onEmergenciesChanged",value:function(e){var t=e.target,n=t.value,a=(t.name,[]);this.state.emergencies.length>0&&("Emergencies (All)"===n?this.setState(function(e){return{filtered_emergencies:e.emergencies,side_bar_open:!1,location_side_bar_open:!1,show_red_circle:!1}}):"None"===n?this.setState({filtered_emergencies:[],side_bar_open:!1,location_side_bar_open:!1,show_red_circle:!1}):(this.state.emergencies.map(function(e){e.reasons&&e.reasons.length>0&&e.reasons.map(function(t){n.toLowerCase().includes(t)&&a.push(e)})}),a.length>0?this.setState({filtered_emergencies:a,side_bar_open:!1,location_side_bar_open:!1,show_red_circle:!1}):this.setState({filtered_emergencies:[],selected_emergency:"Emergencies (All)",side_bar_open:!1,location_side_bar_open:!1,show_red_circle:!1})))}},{key:"onLocationClicked",value:function(e,t){this.setState({selected_location:e,side_bar_open:!1,location_side_bar_open:!0,center:{lat:e.latitude,lng:e.longitude},zoom:18,show_red_circle:!1,show_blue_circle:!0,clicked_marker_id:e._id})}},{key:"onEmergencyClicked",value:function(e,t){this.setState({selected_emergency:e,side_bar_open:!0,location_side_bar_open:!1,center:{lat:e.latitude,lng:e.longitude},zoom:18,show_red_circle:!0,show_blue_circle:!1,clicked_marker_id:e._id})}},{key:"getLocationsMarkers",value:function(){var e=this;return this.state.filtered_locations.length>0?this.state.filtered_locations.map(function(t){return l.a.createElement(w.Marker,{key:t._id,onClick:function(n){return e.onLocationClicked(t,n)},name:t.reason,title:t.full_name,position:{lat:t.latitude,lng:t.longitude},icon:{url:e.state.clicked_marker_id==t._id?f.a:C.a}})}):""}},{key:"getEmergenciesMarkers",value:function(){var e=this;return this.state.filtered_emergencies.length>0?this.state.filtered_emergencies.map(function(t){return l.a.createElement(w.Marker,{key:t._id,onClick:function(n){return e.onEmergencyClicked(t,n)},name:t.reasons[0],title:t.full_name,position:{lat:t.latitude,lng:t.longitude},icon:{url:e.state.clicked_marker_id==t._id?b.a:k.a}})}):""}},{key:"closeSideBar",value:function(e){this.setState({side_bar_open:!1,location_side_bar_open:!1,selected_location:{},selected_emergency:{},clicked_marker_id:""})}},{key:"fetchPlaces",value:function(e,t){}},{key:"componentDidMount",value:function(){var e=this,t=A()("http://18.195.71.164");t.on("connect",function(){return console.log("connected to socket io")}),t.on("emergency",function(t){t&&e.setState(function(e){var n=e.emergencies;return n.push(t),{clicked_marker_id:t._id,emergencies:n,center:{lat:t.latitude,lng:t.longitude}}})}),t.on("call",function(t){t&&e.setState(function(e){var n=e.locations;return n.push(t),{clicked_marker_id:t._id,locations:n,center:{lat:t.latitude,lng:t.longitude}}})}),z.post("/api/getLocations",{date:M}).then(function(t){t&&t.data&&t.data.locations?e.setState({locations:t.data.locations,filtered_locations:t.data.locations}):e.setState({locations:[],filtered_locations:[]})}).catch(function(e){console.log({error:e})}),z.post("/api/getEmergencies",{date:M}).then(function(t){t&&t.data&&t.data.emergencies?e.setState({emergencies:t.data.emergencies,filtered_emergencies:t.data.emergencies}):e.setState({emergencies:[],filtered_emergencies:[]})}).catch(function(e){console.log({error:e})})}},{key:"render",value:function(){var e,t;return e=this.state.location_side_bar_open?l.a.createElement(x,{closeSidebar:this.closeSideBar,location:this.state.selected_location}):"",t=this.state.side_bar_open?l.a.createElement(O,{closeSidebar:this.closeSideBar,emergency:this.state.selected_emergency}):"",l.a.createElement("div",{className:"laser-parent-div",style:F},e,t,l.a.createElement("div",{className:"laser-top-panel"},l.a.createElement("h4",{className:"laser-inline"},"Laser Emergency Admin Platform"),l.a.createElement("div",{className:"laser-controls laser-inline"},l.a.createElement("div",{className:"laser-inline",style:P},l.a.createElement(j.a,{onCalendarOpen:this.onCalendarOpen,maxDate:new Date,style:P,onChange:this.onDateChange,value:this.state.date})),l.a.createElement("select",{style:B,className:"form-control laser-inline laser-150-width",id:"calls",name:"calls",value:this.selected_call,onChange:this.onCallsChanged},l.a.createElement("option",null,"Calls (All)"),l.a.createElement("option",null,"Emergency Management(LASEMA)"),l.a.createElement("option",null,"Police"),l.a.createElement("option",null,"Distress"),l.a.createElement("option",null,"Environmental and Special Offences Task Force"),l.a.createElement("option",null,"Fire / Safety Services"),l.a.createElement("option",null,"Environmental / Noise Pollution"),l.a.createElement("option",null,"Broken Pipe / Water Leakage"),l.a.createElement("option",null,"Pothole / Collapsed Road"),l.a.createElement("option",null,"None")),l.a.createElement("select",{style:B,className:"form-control laser-inline laser-150-width",id:"emergencies",name:"emergencies",value:this.selected_call,onChange:this.onEmergenciesChanged},l.a.createElement("option",null,"Emergencies (All)"),l.a.createElement("option",null,"Police Cases"),l.a.createElement("option",null,"Hospital Cases"),l.a.createElement("option",null,"Fire Cases"),l.a.createElement("option",null,"None")))),l.a.createElement(w.Map,{google:this.props.google,style:F,onReady:this.fetchPlaces,initialCenter:this.state.center,center:this.state.center,zoom:this.state.zoom},this.getLocationsMarkers(),this.getEmergenciesMarkers()))}}]),t}(a.Component),I=Object(w.GoogleApiWrapper)({apiKey:"AIzaSyADNxHcgsHDyx_OSbqxBg5xB5lV2YJDcKI"})(R);var W=function(){return l.a.createElement(i.a,null,l.a.createElement(o.a,{path:"/",exact:!0,component:I}))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(l.a.createElement(W,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},74:function(e,t,n){e.exports=n.p+"static/media/emergency_with_circle.d3c347cf.png"},75:function(e,t,n){e.exports=n.p+"static/media/call_with_circle.be8584e2.png"},76:function(e,t,n){e.exports=n.p+"static/media/emergency.5372e70f.png"},77:function(e,t,n){e.exports=n.p+"static/media/call.8f7505e8.png"},86:function(e,t,n){e.exports=n(183)},91:function(e,t,n){e.exports=n.p+"static/media/logo.5d5d9eef.svg"}},[[86,1,2]]]);
//# sourceMappingURL=main.937c6d41.chunk.js.map