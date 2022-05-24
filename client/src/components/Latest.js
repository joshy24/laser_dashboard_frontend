import React, {Component} from 'react';
import LatestItem from './LatestItem';

import ScrollToBottom from 'react-scroll-to-bottom';

const styling = {
    width: "380px",
    height: "400px"
}

export default class Latest extends Component{
    constructor(props){
        super(props);

        this.state= {

        }


        this.itemClicked = this.itemClicked.bind(this);
    }

    itemClicked(e, item){
        e.preventDefault();
        this.props.latestClicked(item);
    }

    render(){
        return (
            <div className="laser-latest-div laser-shadow">
                <h4 className="text-center laser-black-text">Latest Reports</h4>    
                <ScrollToBottom style={styling}>
                    {
                        this.props.latest.map(item => {
                            return <LatestItem key={item._id} itemClicked={this.itemClicked} item={item}/>
                        })
                    }
                </ScrollToBottom>
            </div>
        );
    }
}