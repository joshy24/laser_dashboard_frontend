import React, {Component} from "react";

import ReactModal from 'react-modal';

import Loader from '../../components/Loader';
import Action from '../Action';

import * as API from '../../api/Api';

ReactModal.setAppElement('#main');

const btn_style_left = {
    marginRight: "8px"
}

const btn_style_right = {
    marginLeft: "8px",
    marginRight: "16px"
}

const controls_style = {
    marginRight: "8px"
}

export default class Agents extends Component{
    constructor(props){
        super(props)

        this.state = {
            firstname: "",
            lastname: "",
            phone_number: "",
            department: "",
            password: "",
            password_again: "",
            error: "",
            isLoading: false
        }

        this.submitClicked = this.submitClicked.bind(this);
        this.onFieldChanged = this.onFieldChanged.bind(this);
        this.showLoading = this.showLoading.bind(this);
        this.hideLoading = this.hideLoading.bind(this);
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

    async submitClicked(e){
        e.preventDefault();

        this.setState({
            error: ""
        })

        if(this.state.firstname.length<=0 || this.state.lastname.length<=0){
            this.setState({
                error: "Please enter a valid first and last name"
            })
            
            return;
        }

        if(this.state.phone_number.length < 11){
            this.setState({
                error: "Please enter a valid phone number"
            })
            
            return;
        }

        if(this.state.department.length < 0){
            this.setState({
                error: "Please enter a valid department"
            })
            
            return;
        }

        if(this.state.password.length < 8 || this.state.password_again.length < 8){
            this.setState({
                error: "Please enter a valid password with 8 characters or more"
            })
            
            return;
        }

        if(this.state.password !== this.state.password_again){
            this.setState({
                error: "Passwords dont match"
            })
            
            return;
        }
        
        const data = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            phone_number: this.state.phone_number,
            department: this.state.department,
            password: this.state.password,
            password_again: this.state.password_again
        }

        this.showLoading();

        const response = await API.createAgent(data)
        
        if(response=="error"){
            this.setState({
                action: "message",
                action_message: "An error occurred creating agent, Please try again later"
            })

            return;
        }

        if(response&&response.data){
            this.hideLoading()
            this.props.closeModalGetAgents();
        }
        else{
            this.setState({
                action: "close"
            })
        }
    }

    componentDidMount(){
        if(this.props.departments.length > 0){
            this.setState(state => {
                return { 
                    department: this.props.departments[0]
                }
            })
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
                    className="Modal"
                    overlayClassName="Overlay"
                    contentLabel="Minimal Modal Example">
                    <h4 className="text-center blue-text">Add Agent</h4>
                    <br/>
                    <h5 className="laser-red-text">{ this.state.error ? this.state.error : "" }</h5>
                    <br/>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="category"><h5>First Name</h5></label>
                            <input required autoComplete="off" id="firstname" type="text" name="firstname" onChange={this.onFieldChanged} value={this.state.firstname} className="form-control bt-login-input" placeholder="First Name"/>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="category"><h5>Last Name</h5></label>
                            <input required autoComplete="off" id="lastname" type="text" name="lastname" onChange={this.onFieldChanged} value={this.state.lastname} className="form-control bt-login-input" placeholder="Last Name"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <br/>
                            <label htmlFor="category"><h5>Phone Number</h5></label>
                            <input required autoComplete="off" id="phone_number" type="phone" name="phone_number" onChange={this.onFieldChanged} value={this.state.phone_number} className="form-control bt-login-input" placeholder="Phone Number"/>
                        </div>
                        <div className="col-md-6">
                            <br/>
                            <label htmlFor="category"><h5>Department</h5></label>
                            <select style={controls_style} className="form-control" id="department" name="department" value={this.state.department} onChange={this.onFieldChanged}>
                                {
                                    this.props.departments.map(dep => {
                                        return <option>{dep}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <br/>
                            <label htmlFor="category"><h5>Password</h5></label>
                            <input required autoComplete="off" id="password" type="password" name="password" onChange={this.onFieldChanged} value={this.state.password} className="form-control bt-login-input" placeholder="Password"/>
                        </div>
                        <div className="col-md-6">
                            <br/>
                            <label htmlFor="category"><h5>Password Again</h5></label>
                            <input required autoComplete="off" id="password_again" type="password" name="password_again" onChange={this.onFieldChanged} value={this.state.password_again} className="form-control bt-login-input" placeholder="Password Again"/>
                        </div>
                    </div>
                    
                    <br/>
                    <br/>
                    <br/>
                    <button className="laser-inline laser-blue-bg laserbtn" style={btn_style_left} onClick={e => this.submitClicked(e)}>create</button>
                    <button className="laser-inline grey-bg laserbtn laser-black-text" style={btn_style_right} onClick={this.props.closeModal}>cancel</button>

                </ReactModal>

                <Loader isLoading={this.state.isLoading}/>
            </div>
        );
    }

}