import React from "react"

import Text from "./Text";

export default function Action(props){

    return <div>{getText(props.action, props.message, props.closeAction)}</div>

}

function getText(action, message, closeAction){
    switch(action){
        case "loading":
        
        return <Text text={"Loading..."} closeAction={closeAction}/>

       
        case "close":
        
        return "";

        case "err_calls_load":
        
        return <Text text={"An Error occurred loading latest calls"} closeAction={closeAction}/>;

        case "err_emergency_load":
        
        return <Text text={"An Error occurred loading latest emergencies"} closeAction={closeAction}/>;

        case "message":

        return <Text text={message} closeAction={closeAction}/> 
    }
}