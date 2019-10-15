var Admin = require('../models/admin.model')
var bcrypt = require('bcryptjs');

module.exports.createAdmin = function(data){
    return new Promise((resolve,reject) => {
        var admin = new Admin(data);

        if(admin.password){
            admin.password = bcrypt.hashSync(admin.password, 10);
        }

        admin.created = Date.now();
        
        admin.save((err,saved) => {
            if(err){
                reject(err.message)
            }

            resolve(saved);
        })
    })
}

module.exports.countAdmins = (req,res) => {
    return new Promise((resolve,reject) => {
        Admin
            .count()
            .exec()
            .then(rem => {
                resolve(rem);
            })
            .catch(error => {
                reject(error.message);
            })
    })
}

module.exports.readAdminUserName = function(name){
    return new Promise((resolve,reject) => {
        Admin.findOne({username: name })
            .exec()
            .then(rem => {
                resolve(rem);
            })
            .catch(error => {
                reject(error.message)
            })
    })
}

module.exports.readAdmin = function(id){
    return new Promise((resolve,reject) => {
        Admin.findOne({_id:id})
            .exec()
            .then(rem => {
                resolve(rem);
            })
            .catch(error => {
                reject(error.message)
            })
    })
}

module.exports.readAllAdmins = function(count){
    return new Promise((resolve,reject) => {
        Admin.find({})
            .sort({created: -1})
            .skip(count)
            .limit(100)
            .exec()
            .then(rem => {
                resolve(rem);
            })
            .catch(error => {
                reject(error.message)
            })
    })
}

module.exports.updateAdmin = function(id, new_data){
    return new Promise((resolve,reject) => {
        Admin.findOne({_id:id}, function (err, admin) {
            if (err){ 
                reject(err.message)
            }
            else{
                admin.set(new_data);
                admin.save(function (err, updatedAdmin) {
                if (err) 
                    reject(err.message)

                    resolve(updatedAdmin);
                });
            }
        
        });
    })
}

module.exports.deleteAdmin = function(id){
    return new Promise((resolve,reject) => {
        Admin.remove({_id:id})//delete the asset from DB
            .exec()
            .then(rem => {
                resolve(rem);
            })
            .catch(error => {
                reject(error.message)
            })
        })
}