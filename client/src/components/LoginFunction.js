import React, {useState} from 'react'

import Loader from '../components/Loader';
 //Our Auth Service
import AuthHelperMethods from '../auth/AuthHelperMethods';

import { useNavigate } from "react-router-dom"

const Auth = new AuthHelperMethods();

const zero_margin = {
    marginBottom: "0px",
    marginTop: "0px"
} 

const Laserlogin = ({login}) => {

    let navigate = useNavigate()

    const [user, setUser] = useState({username: "", password: ""})

    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const showLoading = () => {
        setIsLoading(true)
    }

    const hideLoading = () => {
        setIsLoading(false)
    }
    
    const submitClicked = async(e, item) => {
        e.preventDefault();

        setError("")

        if(user.username.length<=0 || user.password.length<=0){
            setError("Please make sure all fields are completed")
            
            return;
        }

        showLoading();

        const response = await(Auth.login(user.username, user.password));

        hideLoading();

        
        if(response.data == "Not found"){
            setError("Please check the username and password you entered")
        }
        else if(response && response.data && response.data.token && response.data.admin){
            login(); 
            navigate('/')
        }
        else if(response==="error"){
            //show error message

            setError("An error occurred login you in. Please try again later.")

            return;
        }
        else{
            setError("We could not log you in at this moment. Try again later")
        }
    }

     const onFieldChanged = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        
        
        setUser({...user, [name]: value})
    }


    return (
        <div className="laser-login-bg">
            <div className="laser-login-div laser-shadow">
                <h2 className="bt-blue-text laser-white-text" style={zero_margin}>Admin</h2>
                <h2 className="bt-blue-text laser-white-text" style={zero_margin}>Login</h2>
                <br/>
                <br/>
                <h5 className="laser-red-text">{ error ? error : "" }</h5>
                <br/>
                <label className="laser-white-text" htmlFor="category"><h5>User Name</h5></label>
                <input required autoComplete="off" id="username" type="text" name="username" onChange={onFieldChanged} value={user.username} className="form-control bt-login-input" placeholder="User Name"/>
                <br/>
                <label className="laser-white-text" htmlFor="category"><h5>Password</h5></label>
                <input required autoComplete="off" id="password" type="password" name="password" onChange={onFieldChanged} value={user.password} className="form-control bt-login-input" placeholder="Password"/>
                <br/>
                <br/>
                <button className="laser-blue-bg laserbtn" onClick={submitClicked}>CONTINUE</button>    
            </div>
            <Loader isLoading={isLoading}/>
        </div>
    );

}


export default Laserlogin