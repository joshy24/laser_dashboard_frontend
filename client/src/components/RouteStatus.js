import React from "react"

import ReactModal from 'react-modal';

const box_style = {
    margin: "16px"
}


const style = {
    background: "#2E86C1",
    border: "0px solid #000000",
    color: "#FFFFFF",
    padding: "8px",
    borderRadius: "4px",
    float: "left",
    marginLeft: "20px"
}


ReactModal.setAppElement('#main');

export default function OrderStatus(props){
    
    return <div>
                <ReactModal 
                    isOpen={true}
                    className="Modal"
                    overlayClassName="Overlay"
                    contentLabel="Minimal Modal Example">
                    <h4 className="text-center">Message From Agent</h4>
                    <button className="grey-bg bt-btn pull-right" style={box_style} onClick={props.closeRouteResponse}>close</button>
                    <br/>
                    <br/>

                    <div className="row">
                        <div className="col-md-8 col-sm-8">
                            <h5 className="black-text">{props.route_response.agent.agent.firstname} {props.route_response.agent.agent.lastname} has completed the route to {props.route_response.user.full_name}'s location</h5>
                        </div>
                        <div className="col-md-4 col-sm-4">
                            <h5><b>Phone Number</b></h5>
                            <h5>{props.route_response.agent.agent.phone_number}</h5>
                        </div>
                    </div>
                    <div className="row">
                        <h5><button className="green-bg bt-btn" style={style} onClick={e => props.removeAgentFromRouteAndCloseRouteResponse(e, props.route_response)}>Remove Agent From Route</button></h5>
                    </div>

                </ReactModal>
           </div>
}