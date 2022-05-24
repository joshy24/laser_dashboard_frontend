import React, {Component} from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import NewApp from "./NewApp";
import Agents from "./components/agents/Agents";
import Admins from "./components/agents/Admins";
import Departments from "./components/agents/Departments";
import Login from "./components/Login"

import AuthHelperMethods from './auth/AuthHelperMethods';

const Auth = new AuthHelperMethods();

class Laser extends Component{
    constructor(props){
        super(props)

        this.state = {
            isLogin : false
        }

        this.logout = this.logout.bind(this);
        this.login = this.login.bind(this);
    }

    logout = () => {
        Auth.logout();

        this.setState({
            isLogin: true
        })
    }

    login = () => {
        this.setState({
            isLogin: false
        })
    }

    render(){
        return (
            <div>
                <Router>
                    <Route path="/" exact render={(props) => (
                        Auth.loggedIn() === true
                            ? <NewApp {...props} logout={this.logout}/>
                            : <Redirect to='/login' login={this.login} />
                        )} />

                    <Route path="/agents" exact render={(props) => (
                        Auth.loggedIn() === true
                            ?  Auth.getPriviledge() === "full_control" ? <Agents {...props} logout={this.logout} /> : <Redirect to='/' login={this.login} />
                            : <Redirect to='/login' login={this.login} />
                        )}/>

                    <Route path="/admins" exact render={(props) => (
                        Auth.loggedIn() === true
                            ?  Auth.getPriviledge() === "full_control" ? <Admins {...props} logout={this.logout} /> : <Redirect to='/' login={this.login} />
                            : <Redirect to='/login' login={this.login} />
                        )}/>

                    <Route path="/departments" exact render={(props) => (
                        Auth.loggedIn() === true
                            ? Auth.getPriviledge() === "full_control" ? <Departments {...props} logout={this.logout}/> : <Redirect to='/' login={this.login} />
                            : <Redirect to='/login' login={this.login} />
                        )}/>

                    <Route path="/login" exact render={(props) => (
                        Auth.loggedIn() === false
                            ? <Login {...props} login={this.login} />
                            : <Redirect to='/' {...props} logout={this.logout} />
                        )} />
                    {
                        this.state.isLogin==true ? <Redirect to='/login' login={this.login} /> : ""
                    }
                </Router>
                
            </div>
        );
    }
}

export default Laser;