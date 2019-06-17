'use strict'

var Location = require('../models/location.model')

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
    return new Promise((resolve,reject) => {
        Location.find({created:date})
                .exec()
                .then(data => {
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
    })
}