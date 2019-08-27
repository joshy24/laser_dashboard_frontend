'use strict'

var UserService = require('../services/user.service');
var LocationService = require('../services/location.service');
var EmergencyService = require('../services/emergency.service');
var FeedbackService = require('../services/feedback.service');
var bcrypt = require('bcryptjs');
var Utils = require('../modules/utils');
var asyncForEach = require('../modules/asyncforeach');
var filter = require('../modules/filter');
var twilio = require('twilio');

//items in the body of the request need to be checked for the right length and made sure they are properly secured
module.exports.login = function(req,res){
    var phone = req.body.phone_number;
    var password = req.body.password;
    
    if(!password){
        return res.status(400).send({"response":"bad request"});
    }

    if(!phone){
        return res.status(400).send({"response":"bad request"});
    }

    var new_number = Utils.parsePhoneNumber(phone);

    if(new_number==null){
        return res.status(400).send("Incomplete Number");
    }

    UserService.readUserPhoneNumber(new_number)
                .then(user => {
                    if(!user){
                        return res.status(404).send({"response": "not found"});
                    }
                    else{
                        user.comparePassword(password)
                        .then(confirmation => {
                            if(confirmation==true){
                                var token = jwt.sign({id:user._id, firstname: user.firstname, lastname:user.lastname}, config.secret, {issuer: "Laser", audience: "User", expiresIn: 60*60*24*500, algorithm: "HS256"});
                                user.tokens.push(token);
                                UserService.updateUser(user._id, user)
                                        .then(updated_user => {
                                                if(updated_user){
                                                    user.tokens = null;
                                                    user.phone_number = null;
                                                    return res.status(200).send({"user":user, "token":token});
                                                }
                                                else{
                                                    console.log("couldnt update");
                                                    return res.status(500).send("Server Error");
                                                }
                                        })
                                        .catch(err => {
                                            console.log(err.message);
                                            return res.status(400).send("Error");
                                        })
                            }
                            else{
                                return res.status(400).send("Wrong Password");
                            }
                        })
                        .catch(err => {
                            console.log(err.message);
                            return res.status(400).send("Password Error");
                        })
                    }
                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).send("Server Error");
                })
}

module.exports.logout = function(req,res){
    var id = req.user.id;

    req.user.tokens = [];
    UserService.updateUser(id, req.user)
                .then(user => {
                    return res.status(200).send({"response":"success"});
                })
                .catch(err => {
                    console.log(err.message);
                    return res.status(500).send("Server Error");
                })

} 

module.exports.createUser = function(req,res){
    var lastname = req.body.lastname;
    var firstname = req.body.firstname;
    var phone_number = req.body.phone_number;
    var email = req.body.email;
    var password = req.body.password

    if(!firstname||!lastname){ 
        return res.status(400).send({"response":"bad request"});
    }
    
    if(!password||password.length<8){
        return res.status(400).send({"response":"bad request"});
    }

    if(!phone_number&&!email){
        return res.status(400).send({"response":"bad request"});
    }

    var new_number = Utils.parsePhoneNumber(phone_number);

    if(new_number==null){
        return res.status(400).send("Incomplete Number");
    }
    
    var user_obj = {
        lastname: lastname,
        firstname: firstname,
        phone_number: new_number,
        email: email,
        password: password
    }

    UserService.readUserPhoneNumberEmail(new_number,email)
            .then(user => {
                if(!user||user==null){
                    UserService.createUser(user_obj)
                                .then(user => {
                                    var token = jwt.sign({id:user._id, firstname: user.firstname, lastname:user.lastname}, config.secret, {issuer: "Laser", audience: "User", expiresIn: 60*60*24*5, algorithm: "HS256"});
                                    user.tokens = [];
                                    user.tokens.push(token);
                                    UserService.updateUser(user._id, user)
                                                .then(updated_user => {
                                                    user.tokens = null;
                                                    user.password = null;
                                                    user.phone_number = null;
                                                    return res.status(200).send({"user":user, "token":token});
                                                })
                                                .catch(err => {
                                                    console.log(err.message);
                                                    return res.status(500).send("Server Error");
                                                })

                                })
                                .catch(err => {
                                    console.log(err);
                                    return res.status(500).send("Create Server Error");
                                })
                }
                else{
                    res.statusMessage = "User Exists";
                    return res.status(500).send();
                }
            })
            .catch(err => {
                console.log(err.message);
                return res.status(500).send("Server Error");
            })
}

module.exports.saveEmergencyNumbers = function(req,res){
    if(req.body.numbers){
        if(req.body.numbers.length > 0 && req.body.numbers.length<6){
            
        }
        else{

        }
    }
    else{

    }
}

module.exports.saveFeedback = function(req,res){
    var message  = req.body.message;
    var id = req.body.location;
    var action  = req.body.action;
    var user = req.user;

    var data = {};
    data.full_name = user.firstname +" " + user.lastname;

    if(user.email)
        data.email = user.email;

    if(user.phone_number)
        data.phone_number = user.phone_number;

    data.user = user._id;


    if(message){
        data.message = message;
    }
    else{
        data.message = "no message";
    }

    data.location = id;

    FeedbackService.saveFeedback(data)
                .then(saved => {
                    return res.status(200).send({"response":"saved"});
                })
                .catch(err => {
                    return res.status(500).send({"response":err});
                })
}

module.exports.saveEmergencyLocation = function(req,res){
    var lat = req.body.latitude;
    var lng = req.body.longitude;
    var action  = req.body.action;
    var full_address = req.body.full_address;
    var sub_admin_address = req.body.admin_address;
    var is_trackable =  req.body.is_trackable;
    var user = req.user;

    if(!action){
        return res.status(400).send({"response":"bad request"});
    }

    var data = {};
    data.latitude = lat;
    data.longitude = lng;
    data.full_name = user.firstname +" " + user.lastname;

    if(user.email)
        data.email = user.email;

    if(user.phone_number)
        data.phone_number = user.phone_number;

    data.user = user._id;
    data.reason = action;
    data.status = "pending";
    
    data.full_address = full_address;
    data.sub_admin_address = sub_admin_address;

    data.is_trackable = is_trackable;

    LocationService.saveLocation(data)
                .then(saved => {
                    io.emit("call", saved);
                    return res.status(200).send({"response":saved._id});
                })
                .catch(err => {
                    return res.status(500).send({"response":err});
                })
}

module.exports.sendEmergencyMessage = function(req,res){
    var lat = req.body.latitude;
    var lng = req.body.longitude;
    var reasons  = req.body.events;
    var device = req.body.deviceName;
    var numbers = req.body.numbers;
    var full_address = req.body.full_address;
    var sub_admin_address = req.body.admin_address;
    var is_trackable =  req.body.is_trackable;
    var user = req.user;

    if(!reasons){
        return res.status(400).send({"response":"bad request"});
    }

    var data = {};
    data.latitude = lat;
    data.longitude = lng;
    var full_name = user.firstname +" " + user.lastname;
    data.full_name = full_name;

    if(user.email)
        data.email = user.email;

    if(user.phone_number)
        data.phone_number = user.phone_number;

    data.user = user._id;
    data.reasons = reasons;
    data.device = device;

    data.full_address = full_address;
    data.sub_admin_address = sub_admin_address;

    data.is_trackable = is_trackable;
    data.status = "pending";

    if(numbers&&numbers.length>0){
        data.emergency_numbers = numbers;
    }

    EmergencyService.saveEmergency(data)
                .then(saved => {
                    io.emit("emergency", saved);
                    return res.status(200).send({"response":saved._id});
                })
                .catch(err => {
                    return res.status(500).send({"response":err});
                })

    var sid = config.twilio.sid;
    var token = config.twilio.auth_token;
    var phone = config.twilio.phone;
    
    var client = new twilio(sid, token);

    var location = lat +", " +lng;
    
    if(numbers.length>0){
        numbers.map(phone_number => {
            var edited_number = Utils.parsePhoneNumber(phone_number);

            if(edited_number!=null){
                client.messages.create({
                    body: Utils.getEmergencyMessage(full_name, device, full_address, user.phone_number, user.email, reasons),
                    to: "+2348071973021",  // Text this number
                    from:  phone// From a valid Twilio number
                })
                .then((message) => {
                    return res.status(200).send("Msg Sent"); 
                })
                .catch(err => console.log({err}));
            }
        })
    }
}
