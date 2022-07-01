import React, {useState} from "react";
import { BrowserRouter as Router, Route, Navigate, Routes } from "react-router-dom";
import App from "./App";
import Agents from "./components/agents/Agents";
import Admins from "./components/agents/Admins";
import Departments from "./components/agents/Departments";
import Laserlogin from "./components/LoginFunction"

import AuthHelperMethods from './auth/AuthHelperMethods';

const Auth = new AuthHelperMethods();

const LaserFunction = () => {
    const [isLogin, setIsLogin] = useState(false)

    const logout = () => {
        Auth.logout();

        setIsLogin(true)
    }

    const login = () => {
        setIsLogin(false)
    }

    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" exact element={<App />}/>

                    <Route path="/agents" exact element={(props) => (
                        Auth.loggedIn() === true
                            ?  Auth.getPriviledge() === "full_control" ? <Agents {...props} logout={logout} /> : <Navigate to='/' login={login} />
                            : <Navigate to='/login' login={login} />
                        )}/>

                    <Route path="/admins" exact element={(props) => (
                        Auth.loggedIn() === true
                            ?  Auth.getPriviledge() === "full_control" ? <Admins {...props} logout={logout} /> : <Navigate to='/' login={login} />
                            : <Navigate to='/login' login={login} />
                        )}/>

                    <Route path="/departments" exact element={(props) => (
                        Auth.loggedIn() === true
                            ? Auth.getPriviledge() === "full_control" ? <Departments {...props} logout={logout}/> : <Navigate to='/' login={login} />
                            : <Navigate to='/login' login={login} />
                        )}/>

                    <Route path="/login" exact element={<Laserlogin login={login} />}/>

                    {
                        isLogin==true ? <Navigate to='/login' login={login} /> : ""
                    }
                </Routes>
            </Router>
        </div>
    );
}

export default LaserFunction;