'use strict'

var Location = require('../models/location.model')
var Utils = require('../modules/utils');

module.exports.saveLocation = function(data){
    return new Promise((resolve,reject) => {
        var loc = new Location(data);
        loc.created = Date.now();
        loc.save((err,saved) => {
            if(err){
                reject(err.message);
            }

            resolve(saved);
        })
    });
}

module.exports.getLocations = function(date){
    var start = new Date(Utils.getStart(date));

    var end = new Date(Utils.getEnd(date));

    return new Promise((resolve,reject) => {
        Location.find({status: "pending", created:{$gte: start, $lte: end}})
                .exec()
                .then(data => {
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
    })
}

module.exports.readLocation = function(id){
    return new Promise((resolve,reject) => {
        Location.findOne({_id:id})
            .exec()
            .then(rem => {
                resolve(rem);
            })
            .catch(error => {
                reject(error.message)
            })
    })
}

module.exports.updateLocation = function(id, new_data){
    return new Promise((resolve,reject) => {
        Location.findOne({_id:id}, function (err, location) {
            if (err){ 
                reject(err.message)
            }
            else{
                location.set(new_data);
                location.save(function (err, updatedLocation) {
                if (err) 
                    reject(err.message)

                    resolve(updatedLocation);
                });
            }
        
        });
    })
}