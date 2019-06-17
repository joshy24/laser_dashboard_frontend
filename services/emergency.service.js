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

module.exports.getEmergencies = function(date){
    var start = new Date(Utils.getStart(date));

    var end = new Date(Utils.getEnd(date));

    return new Promise((resolve,reject) => {
        Emergency.find({created: {$gte: start, $lt: end}})
                .exec()
                .then(data => {
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
    })
}