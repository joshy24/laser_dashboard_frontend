(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{108:function(e,t,n){},128:function(e,t,n){"use strict";n.r(t);var a=n(0),l=n.n(a),r=n(12),o=n.n(r),s=n(54),c=n(9),i=n(29),m=n(47),d=n(48),u=n(57),g=n(49),_=n(10),h=n(58),p=(n(64),n(50)),E=n.n(p),b=n(51),f=n.n(b),y=n(17);function C(e){return l.a.createElement("div",{className:"laser-side-bar"},l.a.createElement("h1",{className:"close_btn",onClick:function(t){return e.closeSidebar(t)}},"\u2715"),l.a.createElement("br",null),l.a.createElement("h4",{className:"text-center laser-red-text"},l.a.createElement("b",null,"Emergency Location Details")),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Persons Name")," - ",e.emergency.full_name),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Person's Emergency Contacts")," - ",e.emergency.emergency_numbers&&e.emergency.emergency_numbers.length>0?e.emergency.emergency_numbers.map(function(e,t){return l.a.createElement("p",{key:t},e)}):""),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Email Address")," - ",e.emergency.email?e.emergency.email:""),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Phone Number")," - ",e.emergency.phone_number?e.emergency.phone_number:""),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Device")," - ",e.emergency.device?e.emergency.device:""),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Emergency Full Address")," - ",e.emergency.full_address?e.emergency.full_address:""),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Emergency Admin Address")," - ",e.emergency.sub_admin_address?e.emergency.sub_admin_address:""),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Reason For Emergency")," - ",e.emergency.reasons?function(e){switch(e.length){case 0:return"";case 1:return e[0]+" issue";case 2:return e[0]+" issue, "+e[1]+" issue";case 3:return e[0]+" issue, "+e[1]+" issue, "+e[2]+" issue"}}(e.emergency.reasons):""))}function v(e){return l.a.createElement("div",{className:"laser-side-bar"},l.a.createElement("h1",{className:"close_btn",onClick:function(t){return e.closeSidebar(t)}},"\u2715"),l.a.createElement("br",null),l.a.createElement("h4",{className:"text-center laser-blue-text"},l.a.createElement("b",null,"Call Location Details")),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Persons Name")," - ",e.location.full_name),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Email Address")," - ",e.location.email?e.location.email:""),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Phone Number")," - ",e.location.phone_number?e.location.phone_number:""),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Call Full Address")," - ",e.location.full_address?e.location.full_address:""),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Call Admin Address")," - ",e.location.sub_admin_address?e.location.sub_admin_address:""),l.a.createElement("br",null),l.a.createElement("h5",null,l.a.createElement("b",null,"Reason For Call")," - ",e.location.reason?e.location.reason:""))}var k=n(52),S=n.n(k),A=(n(108),n(53)),N={height:"100vh",width:"100%"},x={color:"#111111",border:"1px solid #FFFFFF",zIndex:"6000",marginLeft:"8px",marginRight:"8px",padding:"8px"},w={marginLeft:"8px",marginRight:"8px"},O=n.n(A).a.create({baseURL:"http://18.195.71.164",timeout:5e3,headers:{Accept:"application/json;q=0.9,*/*;q=0.8"}}),L=function(e){function t(e){var n,a;return Object(m.a)(this,t),(a=Object(u.a)(this,Object(g.a)(t).call(this,e))).state=(n={locations:[],emergencies:[],filtered_locations:[],filtered_emergencies:[],side_bar_open:!1,location_side_bar_open:!1,selected_emergency:{},center:{lat:6.5244,lng:3.3792},selected_call:"Calls (All)"},Object(i.a)(n,"selected_emergency","Emergencies (All)"),Object(i.a)(n,"date",new Date),n),a.closeSideBar=a.closeSideBar.bind(Object(_.a)(a)),a.onCallsChanged=a.onCallsChanged.bind(Object(_.a)(a)),a.onEmergenciesChanged=a.onEmergenciesChanged.bind(Object(_.a)(a)),a.onDateChange=a.onDateChange.bind(Object(_.a)(a)),a.onCalendarOpen=a.onCalendarOpen.bind(Object(_.a)(a)),a}return Object(h.a)(t,e),Object(d.a)(t,[{key:"onCalendarOpen",value:function(){this.setState({side_bar_open:!1,location_side_bar_open:!1})}},{key:"onDateChange",value:function(e){var t=this;this.setState({date:e}),O.post("/api/getLocations",{date:e}).then(function(e){console.log(e),e&&e.data&&e.data.locations?t.setState({locations:e.data.locations,filtered_locations:e.data.locations}):t.setState({locations:[],filtered_locations:[]})}).catch(function(e){console.log({error:e})}),O.post("/api/getEmergencies",{date:e}).then(function(e){console.log(e),e&&e.data&&e.data.emergencies?t.setState({emergencies:e.data.emergencies,filtered_emergencies:e.data.emergencies}):t.setState({emergencies:[],filtered_emergencies:[]})}).catch(function(e){console.log({error:e})})}},{key:"onCallsChanged",value:function(e){var t=e.target,n=t.value,a=(t.name,[]);this.state.locations.length>0&&("Calls (All)"===n?this.setState(function(e){return{filtered_locations:e.locations,side_bar_open:!1,location_side_bar_open:!1}}):"None"===n?this.setState({filtered_locations:[],side_bar_open:!1,location_side_bar_open:!1}):(this.state.locations.map(function(e){e.reason.includes(n.toLowerCase())&&a.push(e)}),a.length>0?this.setState({filtered_locations:a,side_bar_open:!1,location_side_bar_open:!1}):this.setState({filtered_locations:[],selected_call:"Calls (All)",side_bar_open:!1,location_side_bar_open:!1})))}},{key:"onEmergenciesChanged",value:function(e){var t=e.target,n=t.value,a=(t.name,[]);this.state.emergencies.length>0&&("Emergencies (All)"===n?this.setState(function(e){return{filtered_emergencies:e.emergencies,side_bar_open:!1,location_side_bar_open:!1}}):"None"===n?this.setState({filtered_emergencies:[],side_bar_open:!1,location_side_bar_open:!1}):(this.state.emergencies.map(function(e){e.reasons&&e.reasons.length>0&&e.reasons.map(function(t){n.toLowerCase().includes(t)&&a.push(e)})}),a.length>0?this.setState({filtered_emergencies:a,side_bar_open:!1,location_side_bar_open:!1}):this.setState({filtered_emergencies:[],selected_emergency:"Emergencies (All)",side_bar_open:!1,location_side_bar_open:!1})))}},{key:"onLocationClicked",value:function(e,t){this.setState({selected_location:e,side_bar_open:!1,location_side_bar_open:!0,center:{lat:e.latitude,lng:e.longitude}})}},{key:"onEmergencyClicked",value:function(e,t){this.setState({selected_emergency:e,side_bar_open:!0,location_side_bar_open:!1,center:{lat:e.latitude,lng:e.longitude}})}},{key:"getLocationsMarkers",value:function(){var e=this;return this.state.filtered_locations.length>0?this.state.filtered_locations.map(function(t){return l.a.createElement(y.Marker,{key:t._id,onClick:function(n){return e.onLocationClicked(t,n)},name:t.reason,title:t.full_name,position:{lat:t.latitude,lng:t.longitude},icon:{url:f.a}})}):""}},{key:"getEmergenciesMarkers",value:function(){var e=this;return this.state.filtered_emergencies.length>0?this.state.filtered_emergencies.map(function(t){return l.a.createElement(y.Marker,{key:t._id,onClick:function(n){return e.onEmergencyClicked(t,n)},name:t.reasons[0],title:t.full_name,position:{lat:t.latitude,lng:t.longitude},icon:{url:E.a}})}):""}},{key:"closeSideBar",value:function(e){this.setState({side_bar_open:!1,location_side_bar_open:!1,selected_location:{},selected_emergency:{}})}},{key:"fetchPlaces",value:function(e,t){}},{key:"componentDidMount",value:function(){var e=this;O.post("/api/getLocations",{}).then(function(t){console.log(t),t&&t.data&&t.data.locations?e.setState({locations:t.data.locations,filtered_locations:t.data.locations}):e.setState({locations:[],filtered_locations:[]})}).catch(function(e){console.log({error:e})}),O.post("/api/getEmergencies",{}).then(function(t){console.log(t),t&&t.data&&t.data.emergencies?e.setState({emergencies:t.data.emergencies,filtered_emergencies:t.data.emergencies}):e.setState({emergencies:[],filtered_emergencies:[]})}).catch(function(e){console.log({error:e})})}},{key:"render",value:function(){var e,t;return e=this.state.location_side_bar_open?l.a.createElement(v,{closeSidebar:this.closeSideBar,location:this.state.selected_location}):"",t=this.state.side_bar_open?l.a.createElement(C,{closeSidebar:this.closeSideBar,emergency:this.state.selected_emergency}):"",l.a.createElement("div",{style:N},e,t,l.a.createElement("div",{className:"laser-top-panel"},l.a.createElement("h4",{className:"laser-inline"},"Laser Emergency Admin Platform"),l.a.createElement("div",{className:"laser-controls laser-inline"},l.a.createElement("div",{className:"laser-inline",style:x},l.a.createElement(S.a,{onCalendarOpen:this.onCalendarOpen,maxDate:new Date,style:x,onChange:this.onDateChange,value:this.state.date})),l.a.createElement("select",{style:w,className:"form-control laser-inline laser-150-width",id:"calls",name:"calls",value:this.selected_call,onChange:this.onCallsChanged},l.a.createElement("option",null,"Calls (All)"),l.a.createElement("option",null,"Emergency Management(LASEMA)"),l.a.createElement("option",null,"Police"),l.a.createElement("option",null,"Distress"),l.a.createElement("option",null,"Environmental and Special Offences Task Force"),l.a.createElement("option",null,"Fire / Safety Services"),l.a.createElement("option",null,"Environmental / Noise Pollution"),l.a.createElement("option",null,"Broken Pipe / Water Leakage"),l.a.createElement("option",null,"Pothole / Collapsed Road"),l.a.createElement("option",null,"None")),l.a.createElement("select",{style:w,className:"form-control laser-inline laser-150-width",id:"emergencies",name:"emergencies",value:this.selected_call,onChange:this.onEmergenciesChanged},l.a.createElement("option",null,"Emergencies (All)"),l.a.createElement("option",null,"Police Cases"),l.a.createElement("option",null,"Hospital Cases"),l.a.createElement("option",null,"Fire Cases"),l.a.createElement("option",null,"None")))),l.a.createElement(y.Map,{google:this.props.google,style:N,onReady:this.fetchPlaces,initialCenter:this.state.center,center:this.state.center,zoom:11},this.getLocationsMarkers(),this.getEmergenciesMarkers()))}}]),t}(a.Component),D=Object(y.GoogleApiWrapper)({apiKey:"AIzaSyADNxHcgsHDyx_OSbqxBg5xB5lV2YJDcKI"})(L);var j=function(){return l.a.createElement(s.a,null,l.a.createElement(c.a,{path:"/",exact:!0,component:D}))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(l.a.createElement(j,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},50:function(e,t,n){e.exports=n.p+"static/media/emergency.5372e70f.png"},51:function(e,t,n){e.exports=n.p+"static/media/call.8f7505e8.png"},59:function(e,t,n){e.exports=n(128)},64:function(e,t,n){e.exports=n.p+"static/media/logo.5d5d9eef.svg"}},[[59,1,2]]]);
//# sourceMappingURL=main.93dd222c.chunk.js.map