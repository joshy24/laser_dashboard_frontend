'use strict'

var Agent = require('../models/agent.model')
var Utils = require('../modules/utils');
var bcrypt = require('bcryptjs');

module.exports.saveAgent = function(data){
    return new Promise((resolve,reject) => {
        var loc = new Agent(data);
        loc.password = bcrypt.hashSync(loc.password, 10);
        loc.created = Date.now();
        loc.save((err,saved) => {
            if(err){
                reject(err.message);
            }

            resolve(saved);
        })
    });
}

module.exports.readAgent = function(id){
    return new Promise((resolve,reject) => {
        Agent.findOne({_id:id})
            .exec()
            .then(rem => {
                resolve(rem);
            })
            .catch(error => {
                reject(error.message)
            })
    })
}

module.exports.readAllAgents = function(id){
    return new Promise((resolve,reject) => {
        Agent.find({})
            .exec()
            .then(rem => {
                resolve(rem);
            })
            .catch(error => {
                reject(error.message)
            })
    })
}

module.exports.readAllAgentsDepartment = (department) => {
    return new Promise((resolve,reject) => {
        Agent.find({department: department})
            .exec()
            .then(rem => {
                resolve(rem);
            })
            .catch(error => {
                reject(error.message)
            })
    })
}

module.exports.readAgentPhoneNumber = function(phone){
    return new Promise((resolve,reject) => {
        Agent.findOne({phone_number:phone})
            .exec()
            .then(rem => {
                resolve(rem);
            })
            .catch(error => {
                reject(error.message)
            })
    })
}

module.exports.updateAgent = function(id, new_data){
    return new Promise((resolve,reject) => {
        Agent.findOne({_id:id}, function (err, agent) {
            if (err){ 
                reject(err.message)
            }
            else{
                agent.set(new_data);

                agent.save(function (err, updatedAgent) {
                    if (err) 
                        reject(err.message)

                    resolve(updatedAgent);
                });
            }
        
        });
    })
}

module.exports.deleteAgent = function(id){
    return new Promise((resolve,reject) => {
        Department.remove({_id:id})//delete the asset from DB
            .exec()
            .then(rem => {
                resolve(rem);
            })
            .catch(error => {
                reject(error.message)
            })
        })
}