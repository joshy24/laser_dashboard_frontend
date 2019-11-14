'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var AdminSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        maxlength: 100
    },
    lastname: {
        type: String,
        required: true,
        maxlength: 100
    },
    username: {
        type: String,
        required: true,
        maxlength: 100
    },
    phone_number: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        dafault: Date.now(),
        required:true
    },
    priviledge: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 3
    },
    tokens:[{
        type: String   
    }],
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength:100
    }
});


AdminSchema.methods.comparePassword = function(password){
    return bcrypt.compare(password, this.password);
}

AdminSchema.index({username:1}, {unique:true});

module.exports = mongoose.model('Admin', AdminSchema);