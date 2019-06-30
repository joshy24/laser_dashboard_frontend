'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AgentSchema = new Schema({
    //We need the 
    //name
    //department/agency examples are - police, fire service, medical
    //phone number
    //vehicle details
    //department id

    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    phone_number: String,
    created: {
        type: Date,
        dafault: new Date(),
        required:true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength:100
    },
    agency: {
        type: String,
        required: true
    },
    tokens:[{
        type: String   
    }]
});

module.exports = mongoose.model('Agent', AgentSchema);