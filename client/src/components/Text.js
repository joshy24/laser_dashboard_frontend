import React from 'react';

const style = {
    width: "100%"
}

export default function Text(props){
    return  <div className="laser-action_div laser-shadow">
                <div className="row">
                    <div className="col-md-12">
                        <h1 style={style}><span onClick={e => props.closeAction(e)} className="action_close_btn">&#10005;</span></h1>
                    </div>
                    <div className="col-md-12">
                        <h5>{props.text}</h5>
                    </div>
                </div>
            </div>;
}