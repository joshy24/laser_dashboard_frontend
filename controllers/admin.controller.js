'use strict'

var LocationService = require('../services/location.service');
var EmergencyService = require('../services/emergency.service');
var FeedbackService = require('../services/feedback.service');
var Utils = require('../modules/utils');
var asyncForEach = require('../modules/asyncforeach');
var filter = require('../modules/filter');
var twilio = require('twilio');

module.exports.getLocations = function(req,res){
    LocationService.getLocations()
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
    EmergencyService.getEmergencies()
        .then(emergencies => {
            return res.status(200).send({"emergencies":emergencies});
        })
        .catch(err => {
            return res.status(200).send({"emergencies":[]});
        })
}