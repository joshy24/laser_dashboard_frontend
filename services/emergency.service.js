'use strict'

var Emergency = require('../models/emergency.model')
var Utils = require('../modules/utils');

module.exports.saveEmergency = function(data){
    return new Promise((resolve,reject) => {
        var loc = new Emergency(data);
        loc.created = Date.now();
        loc.save((err,saved) => {
            if(err){
                reject(err.message);
            }

            resolve(saved);
        })
    });
}

module.exports.readEmergency = function(id){
    return new Promise((resolve,reject) => {
        Emergency.findOne({_id:id})
            .exec()
            .then(rem => {
                resolve(rem);
            })
            .catch(error => {
                reject(error.message)
            })
    })
}

module.exports.updateEmergency = function(id, new_data){
    return new Promise((resolve,reject) => {
        Emergency.findOne({_id:id}, function (err, emergency) {
            if (err){ 
                reject(err.message)
            }
            else{
                emergency.set(new_data);
                emergency.save(function (err, updatedEmergency) {
                if (err) 
                    reject(err.message)

                    resolve(updatedEmergency);
                });
            }
        
        });
    })
}

module.exports.getEmergencies = function(date){
    var start = new Date(Utils.getStart(date));

    var end = new Date(Utils.getEnd(date));

    return new Promise((resolve,reject) => {
        Emergency.find({status: "pending", created: {$gte: start, $lte: end}})
                .exec()
                .then(data => {
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
    })
}