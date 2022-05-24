import React, {Component} from "react";

import ReactModal from 'react-modal';

import Loader from '../../components/Loader';
import Action from '../Action';

import * as API from '../../api/Api';

ReactModal.setAppElement('#main');

const btn_style_left = {
    marginLeft: "16px",
    marginRight: "8px"
}

const btn_style_right = {
    marginLeft: "8px",
    marginRight: "16px"
}

export default class AddDepartment extends Component{
    constructor(props){
        super(props)

        this.state = {
            name: "",
            action: "loading",
            action_message: "",
            isLoading: false
        }

        this.showLoading = this.showLoading.bind(this);
        this.hideLoading = this.hideLoading.bind(this);
        this.onFieldChanged = this.onFieldChanged.bind(this);
        this.saveDepartment = this.saveDepartment.bind(this)
    }

    showLoading(){
        this.setState({
            isLoading: true
        })
    }

    hideLoading(){
        this.setState({
            isLoading: false
        })
    }

    async saveDepartment(){
        if(this.state.name.length > 0){
            const response = await API.createDepartment(this.state.name)
        
            if(response=="error"){
                this.setState({
                    action: "message",
                    action_message: "An error occurred creating department, Please try again later"
                })

                return;
            }

            if(response&&response.data){
                this.props.closeModal();
                this.props.getDepartments();
            }
            else{
                this.setState({
                    action: "close"
                })
            }
        }
    }

    onFieldChanged(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        
        this.setState({
            [name]: value
        })
    }

    render(){
        return (
            <div>
                <ReactModal 
                    isOpen={true}
                    className="ConfirmModal"
                    overlayClassName="Overlay"
                    contentLabel="Minimal Modal Example">
                    <h4 className="text-center blue-text">Add Department</h4>
                    <label className="laser-white-text" htmlFor="category"><h5>Department Name</h5></label>
                    <input required autoComplete="off" id="name" type="text" name="name" onChange={this.onFieldChanged} value={this.state.name} className="form-control bt-login-input" placeholder="Department Name"/>
                    <br/>
                    <button className="laser-inline laser-blue-bg laserbtn" style={btn_style_left} onClick={this.saveDepartment}>save</button>
                    <button className="laser-inline grey-bg laserbtn" style={btn_style_right} onClick={this.props.closeModal}>cancel</button>
                </ReactModal>
                <Loader isLoading={this.state.isLoading}/>
            </div>
        );
    }

}