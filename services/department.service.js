'use strict'

var Department = require('../models/department.model')

module.exports.createDepartment = function(data){
    return new Promise((resolve,reject) => {
        var department = new Department(data);
        department.created = Date.now();
        department.save((err,saved) => {
            if(err){
                reject(err.message)
            }

            resolve(saved);
        })
    })
}

module.exports.readDepartment = function(id){
    return new Promise((resolve,reject) => {
        Department.findOne({_id:id})
            .exec()
            .then(rem => {
                resolve(rem);
            })
            .catch(error => {
                reject(error.message)
            })
    })
}

module.exports.readAllDepartments = function(id){
    return new Promise((resolve,reject) => {
        Department.find({})
            .exec()
            .then(rem => {
                resolve(rem);
            })
            .catch(error => {
                reject(error.message)
            })
    })
}

module.exports.updateDepartment = function(id, new_data){
    return new Promise((resolve,reject) => {
        Department.findOne({_id:id}, function (err, department) {
            if (err){ 
                reject(err.message)
            }
            else{
                department.set(new_data);
                department.save(function (err, updatedDepartment) {
                if (err) 
                    reject(err.message)

                    resolve(updatedDepartment);
                });
            }
        
        });
    })
}

module.exports.deleteDepartment = function(id){
    return new Promise((resolve,reject) => {
        Department.remove({_id:id})//delete the asset from DB
            .exec()
            .then(rem => {
                resolve(rem);
            })
            .catch(error => {
                reject(error.message)
            })
        })
}