'use strict'

var User = require('../models/user.model')
var bcrypt = require('bcryptjs');

module.exports.createUser = function(data){
    return new Promise((resolve,reject) => {
        var user = new User(data);
        user.password = bcrypt.hashSync(user.password, 10);
        user.created = Date.now();
        user.save((err,saved) => {
            if(err){
                reject(err.message)
            }

            resolve(saved);
        })
    })
}

module.exports.readUser = function(id){
    return new Promise((resolve,reject) => {
        User.findOne({_id:id})
            .exec()
            .then(rem => {
                resolve(rem);
            })
            .catch(error => {
                reject(error.message)
            })
    })
}

module.exports.readUserEmail = function(email){
    return new Promise((resolve,reject) => {
        User.findOne({email:email})
            .exec()
            .then(rem => {
                resolve(rem);
            })
            .catch(error => {
                reject(error.message)
            })
    })
}

module.exports.readUserPhoneNumber = function(phone){
    return new Promise((resolve,reject) => {
        User.findOne({phone_number:phone})
            .exec()
            .then(rem => {
                resolve(rem);
            })
            .catch(error => {
                reject(error.message)
            })
    })
}

module.exports.readUserPhoneNumberEmail = function(phone,email){
    return new Promise((resolve,reject) => {
        User.findOne({$or : [ {phone_number:phone}, {email:email}]})
            .exec()
            .then(rem => {
                resolve(rem);
            })
            .catch(error => {
                reject(error.message)
            })
    })
}

module.exports.updateUser = function(id, new_data){
    return new Promise((resolve,reject) => {
        User.findOne({_id:id}, function (err, user) {
            if (err){ 
                reject(err.message)
            }
            else{
                user.set(new_data);
                user.save(function (err, updatedUser) {
                if (err) 
                    reject(err.message)

                    resolve(updatedUser);
                });
            }
        
        });
    })
}

module.exports.deleteUser = function(id){
    return new Promise((resolve,reject) => {
        User.remove({_id:id})//delete the asset from DB
            .exec()
            .then(rem => {
                resolve(rem);
            })
            .catch(error => {
                reject(error.message)
            })
        })
}
