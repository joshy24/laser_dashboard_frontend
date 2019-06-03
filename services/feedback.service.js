'use strict'

var Feedback = require('../models/feedback.model')

module.exports.saveFeedback = function(data){
    return new Promise((resolve,reject) => {
        var loc = new Feedback(data);
        loc.created = Date.now();
        loc.save((err,saved) => {
            if(err){
                reject(err.message);
            }

            resolve(saved);
        })
    });
}

module.exports.getAllFeedback = function(){
    return new Promise((resolve,reject) => {
        Feedback.find({})
                .exec()
                .then(data => {
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
    })
}