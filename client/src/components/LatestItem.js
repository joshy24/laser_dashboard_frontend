import React from 'react';

import Utils from '../utils/Utils';

const utils = new Utils();

const style = {
    background: "rgba(0,0,0,0)",
    border: "0px solid #000000"
}

export default function LatestItem(props){
    return <button className="laserItem" style={style} onClick={e => props.itemClicked(e, props.item)}>
                <h5 style={getColor(props.item.laser_type)}>{props.item.full_name} - {utils.getTime(props.item.created)} - {props.item.sub_admin_address}</h5>
           </button>
}

function getColor(laser_type){
    switch(laser_type){
        case "emergency":
            return {
                color: "#E74C3C",
                textAlign: "left"
            }
        case "call":
            return {
                color: "#3498DB",
                textAlign: "left"
            }
        default:
            return {
                color: "#000000",
                textAlign: "left"
            }
    }
}