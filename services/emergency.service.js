'use strict'

var Emergency = require('../models/emergency.model')

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

module.exports.getEmergencies = function(date){
    return new Promise((resolve,reject) => {
        Emergency.find({created:date})
                .exec()
                .then(data => {
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
    })
}