import React, {Component} from 'react'

import Loader from '../components/Loader';

//Our Auth Service
import AuthHelperMethods from '../auth/AuthHelperMethods';

const Auth = new AuthHelperMethods();

const zero_margin = {
    marginBottom: "0px",
    marginTop: "0px"
}

export default class Login extends Component{
    constructor(props){
        super(props);

        this.state= {
            username: "",
            password: "",
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
    
    async submitClicked(e, item){
        e.preventDefault();

        this.setState({
            error: ""
        })

        if(this.state.username.length<=0 || this.state.password.length<=0){
            this.setState({
                error: "Please make sure all fields are completed"
            })
            
            return;
        }

        this.showLoading();

        const response = await(Auth.login(this.state.username, this.state.password));

        this.hideLoading();

        if(response==="error"){
            //show error message

            this.setState({
                error: "An error occurred login you in. Please try again later."
            })

            return;
        }

        if(response && response.data){
            this.props.login();
            this.props.history.push('/')
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
            <div className="laser-login-bg">
                <div className="laser-login-div laser-shadow">
                    <h2 className="bt-blue-text laser-white-text" style={zero_margin}>Admin</h2>
                    <h2 className="bt-blue-text laser-white-text" style={zero_margin}>Login</h2>
                    <br/>
                    <br/>
                    <h5 className="laser-red-text">{ this.state.error ? this.state.error : "" }</h5>
                    <br/>
                    <label className="laser-white-text" htmlFor="category"><h5>User Name</h5></label>
                    <input required autoComplete="off" id="username" type="text" name="username" onChange={this.onFieldChanged} value={this.state.username} className="form-control bt-login-input" placeholder="User Name"/>
                    <br/>
                    <label className="laser-white-text" htmlFor="category"><h5>Password</h5></label>
                    <input required autoComplete="off" id="password" type="password" name="password" onChange={this.onFieldChanged} value={this.state.password} className="form-control bt-login-input" placeholder="Password"/>
                    <br/>
                    <br/>
                    <button className="laser-blue-bg laserbtn" onClick={this.submitClicked}>CONTINUE</button>    
                </div>
                <Loader isLoading={this.state.isLoading}/>
            </div>
        );
    }
}