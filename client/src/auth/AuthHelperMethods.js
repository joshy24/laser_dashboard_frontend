import axios from 'axios';

import decode from 'jwt-decode'

const login_url = '/login'

export default class AuthHelperMethods{

    login = (username, password) => {
        return  this.axios(login_url, {username, password})
                    .then(res => {
                        this.setToken(res.data.token);
                        this.setPriviledge(res.data.priviledge);
                        this.setAdmin(res.data.admin);
                        console.log(res.data)
                        return res;
                    })
                    .catch(err => {
                        return "error";
                    })
    }

    loggedIn = () => {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken(); // Getting token from localstorage
        return !!token && !this.isTokenExpired(token); // handwaiving here
    };

    isTokenExpired = token => {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
            // Checking if token is expired.
            return true;
            } else return false;
        } catch (err) {
            console.log("expired check failed! Line 42: AuthService.js");
            return false;
        }
    };


    setAdmin = admin => {
        // Saves user token to localStorage
        localStorage.setItem("admin", JSON.stringify(admin));
    };

    getAdmin = () => {
        // Retrieves the user token from localStorage
        return JSON.parse(localStorage.getItem("admin"));
    };

    setToken = idToken => {
        // Saves user token to localStorage
        localStorage.setItem("id_token", idToken);
    };

    getToken = () => {
        // Retrieves the user token from localStorage
        return localStorage.getItem("id_token");
    };

    logout = () => {
        // Clear user token and profile data from localStorage
        localStorage.removeItem("id_token");
    };

    getConfirm = () => {
        // Using jwt-decode npm package to decode the token
        let answer = decode(this.getToken());
        console.log("Recieved answer!");
        return answer;
    };

    setPriviledge = priviledge => {
        localStorage.setItem("priviledge", priviledge);
    }

    getPriviledge = () => {
        return localStorage.getItem("priviledge");
    }
    
    axios = (url, data, method) => {
        if(!method){
            method = "post";
        }
        // performs api calls sending the required authentication headers
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.loggedIn()) {
            headers["Authorization"] = "Bearer:" + this.getToken();
        }

        return axios({
            url:url,
            method: method,
            data: data, 
            baseURL: 'http://18.192.254.193/admin',
            //baseURL: 'http://localhost:3077/admin',
            timeout: 30000,
            headers: headers
        })
        .then(this._checkStatus)
        .then(response => response)
        .catch(err => err)
    };

    _checkStatus = response => {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) {
            // Success status lies between 200 to 300
            return response;
        } else {
            var error = new Error(response.statusText);
            error.response = response;
            throw error;
        }
    };

}