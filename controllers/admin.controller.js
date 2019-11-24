'use strict'

var LocationService = require('../services/location.service');
var EmergencyService = require('../services/emergency.service');
var FeedbackService = require('../services/feedback.service');
var AdminService = require('../services/admin.service');
var DepartmentService = require('../services/department.service');
var Utils = require('../modules/utils');
var asyncForEach = require('../modules/asyncforeach');
var filter = require('../modules/filter');
var twilio = require('twilio');

module.exports.login = (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password){
        return res.status(400).send("Bad Request");
    }

    if(username.length<0 || username.length>=100){
        return res.status(400).send("Bad Request");
    }

    if(password.length<0 || password.length>=100){
        return res.status(400).send("Bad Request");
    }

    AdminService.readAdminUserName(username)
                .then(admin => {
                    if(admin){
                        admin.comparePassword(password)
                            .then(confirmation => {
                                if(confirmation==true){
                                    var token = jwt.sign({id:admin._id, username: admin.username, priviledge: admin.priviledge}, config.secret, {issuer: "Laser", audience: "Admin", expiresIn: 60*60*24*5, algorithm: "HS256"});
                                    admin.tokens.push(token);
                                    AdminService.updateAdmin(admin._id, admin)
                                            .then(updated_admin => {
                                                    if(updated_admin){
                                                        admin.tokens = null;
                                                        return res.status(200).send({"token": token, "priviledge": admin.priviledge});
                                                    }
                                                    else{
                                                        return res.status(500).send("Server Error");
                                                    }
                                            })
                                            .catch(err => {
                                                console.log(err);
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
                    else{
                        console.log("Login Error")
                        return res.status(404).send({});
                    }
                })
                .catch(err => {
                    return res.status(500).send("Server Error");
                })
}

module.exports.createAdmin = (req,res) => {
    const username = req.body.username;
    const phone_number = req.body.phone_number;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const password = req.body.password;
    const priviledge = req.body.priviledge;

    if(!username){
        return res.status(400).send("Bad Request Name");
    }

    if(!firstname || !lastname || !password || !priviledge){
        return res.status(400).send("Bad Request Name");
    }

    if(password.length<0 || password.length>=100){
        return res.status(400).send("Bad Request");
    }

    if(priviledge.length < 0 || priviledge >= 100){
        return res.status(400).send("Bad Request");
    }

    if(phone_number.length < 0 || phone_number >= 20){
        return res.status(400).send("Bad Request");
    }
    
    var new_number = Utils.parsePhoneNumber(phone_number);

    if(new_number==null){
        return res.status(400).send("Incomplete Number");
    }

    AdminService.createAdmin({username: username, password: password, lastname: lastname, phone_number:new_number, firstname: firstname, priviledge: priviledge})
                .then(created_admin => {
                    return res.status(200).send("created");
                })
                .catch(err =>{
                    console.log({err})
                    return res.status(500).send(err.message);
                })
}

module.exports.editAdmin = (req,res) => {
    const id = req.body.id
    const username = req.body.username;
    const phone_number = req.body.phone_number;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const password = req.body.password;
    const priviledge = req.body.priviledge;

    if(!username || !id){
        return res.status(400).send("Bad Request Name");
    }

    if(!firstname || !lastname || !password || !priviledge){
        return res.status(400).send("Bad Request Name");
    }

    if(password.length<0 || password.length>=100){
        return res.status(400).send("Bad Request");
    }

    if(priviledge.length < 0 || priviledge >= 100){
        return res.status(400).send("Bad Request");
    }

    if(phone_number.length < 0 || phone_number >= 20){
        return res.status(400).send("Bad Request");
    }

    var new_number = Utils.parsePhoneNumber(phone_number);

    if(new_number==null){
        return res.status(400).send("Incomplete Number");
    }

    AdminService.readAdmin(id)
        .then(admin => {
            if(admin){
                AdminService.updateAdmin(admin._id, {username: username, password: password, lastname: lastname, phone_number:new_number, firstname: firstname, priviledge: priviledge})
                        .then(updated_admin => {
                            return res.status(200).send("updated");
                        })
                        .catch(err => {
                            console.log({err})
                            return res.status(500).send(err.message);
                        })
            }
            else{
                return res.status(404).send("Not Found");
            }
        })
        .catch(err => {
            console.log({err})
            return res.status(500).send(err.message);
        })
}

module.exports.deleteAdmin = (req,res) => {

}

module.exports.getAdmins = (req,res) => {
    const count = parseInt(req.body.count);

    AdminService.readAllAdmins(count)
                .then(admins => {
                    return res.status(200).send(admins);
                })
                .catch(err => {
                    return res.status(500).send(err);
                })
}

module.exports.getLocations = function(req,res){
    var date = req.body.date;
    
    if(!date){
        date = new Date().toISOString(); 
    }

    LocationService.getLocations(date)
        .then(locations => {
            
            const results = async(() => {

                var arrays = [];

                await(asyncForEach(locations,location => {
                    await(FeedbackService.getFeedback(location._id)
                        .then(feedback => {
                            if(feedback){
                                var new_obj = Object.assign({}, location._doc, {feedback:feedback});
                                arrays.push(new_obj);
                            }
                            else{
                                var new_obj = Object.assign({}, location._doc);
                                arrays.push(new_obj);
                            }
                        })
                        .catch(error => {
                            console.log({error});
                        }))
                }))

                return arrays;
            })

            results()
                .then(data => {
                    return res.status(200).send({"locations":data});
                })
                .catch(err => {
                    console.log({err});
                })
        })
        .catch(err => {
            console.log({err});
        })
}

module.exports.getEmergencies = function(req,res){

    var date = req.body.date;
    
    if(!date){
        date = new Date().toISOString(); 
    }
    
    EmergencyService.getEmergencies(date)
            .then(emergencies => {
                return res.status(200).send({"emergencies":emergencies});
            })
            .catch(err => {
                console.log({err});
                return res.status(200).send({"emergencies":[]});
            })
}

module.exports.saveManualEmergencyLocation = function(req,res){
    var action = req.body.action;
    var longitude = req.body.longitude;
    var latitude = req.body.latitude;
    var full_address = full_address;
    var full_name = req.body.full_name;
    var phone_number = req.body.phone_number;
    var is_trackable = false;

    if(!action){
        return res.status(400).send({"response":"bad request"});
    }

    if(longitude && latitude){
        geocoder.reverse({lat:latitude, lon:longitude}, function(err, res) {
            if(err){
                return res.status(500).send({"response":err});
            }
            else{
                if(res[0].city === "Lagos"){
                    var data = {};
                    data.latitude = latitude;
                    data.longitude = longitude;

                    data.full_name = full_name;
                    data.phone_number = phone_number;
                    data.reason = action;
                    data.status = "pending";
                    
                    data.full_address = full_address;
                    data.sub_admin_address = res[0].administrativeLevels.level2long;
                    data.is_trackable = is_trackable;

                    LocationService.saveLocation(data)
                                .then(saved => {
                                    io.emit("call", saved);
                                    return res.status(200).send({"response":saved});
                                })
                                .catch(err => {
                                    console.log({err})
                                    return res.status(500).send({"response":err});
                                })
                }
                else{
                    return res.status(200).send({"response":"out_of_lagos"});
                }
            }
        });
    }
    else{
        return res.status(400).send({"response":"bad request"});
    }
}


//resolve issues
module.exports.resolveEmergency = (req,res) => {
    const id = req.body.id

    if(!id){
        return res.status(400).send("bad request");
    }

    EmergencyService.readEmergency(id)
                    .then(emergency => {
                        if(emergency){
                            emergency.status = "resolved";

                            EmergencyService.updateEmergency(emergency._id, emergency)
                                            .then(updated => {
                                                return res.status(200).send("success");
                                            })
                                            .catch(err => {
                                                return res.status(500).send("error");
                                            })
                        }
                        else{
                            return res.status(404).send("not found");
                        }
                    })
                    .catch(err => {
                        return res.status(500).send("error");
                    })

}

module.exports.resolveCall = (req,res) => {
    const id = req.body.id

    if(!id){
        return res.status(400).send("bad request");
    }

    LocationService.readLocation(id)
                    .then(location => {
                        if(location){
                            location.status = "resolved";

                            LocationService.updateLocation(location._id, location)
                                            .then(updated => {
                                                return res.status(200).send("success");
                                            })
                                            .catch(err => {
                                                return res.status(500).send("error");
                                            })
                        }
                        else{
                            return res.status(404).send("not found");
                        }
                    })
                    .catch(err => {
                        return res.status(500).send("error");
                    })

}

//Department Functions

module.exports.createDepartment = (req,res) => {
    const name = req.body.name;

    if(!name){
        return res.status(400).send("bad request");
    }

    DepartmentService.createDepartment({name})
                    .then(department => {
                        return res.status(200).send(department);
                    })
                    .catch(err => {
                        return res.status(500).send("error");
                    })

}

module.exports.editDepartment = (req,res) => {
    const name = req.body.name;
    const id = req.body.id;

    if(!name || !id){
        return res.status(400).send("bad request");
    }

    DepartmentService.readDepartment(id)
                    .then(department => {
                        if(department){
                            DepartmentService.updateDepartment(id, {name:name})
                                    .then(department => {
                                        return res.status(200).send(department);
                                    })
                                    .catch(err => {
                                        return res.status(500).send("error");
                                    })
                        }
                        else{
                            return res.status(404).send("not found");
                        }
                    })
                    .catch(err => {
                        return res.status(500).send("error");
                    })
}

module.exports.getDepartments = (req,res) => {
    DepartmentService.readAllDepartments()
                    .then(departments => {
                        return res.status(200).send(departments);
                    })
                    .catch(err => {
                        return res.status(500).send("error");
                    })
}

module.exports.deleteDepartment = (req,res) => {
    const id = req.body.id;

    if(!id){
        return res.status(400).send("bad request");
    }
    
    DepartmentService.deleteDepartment(id)
                    .then(done => {
                        return res.status(200).send("success");
                    })
                    .catch(err => {
                        return res.status(500).send("error");
                    })
}