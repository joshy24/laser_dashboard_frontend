'use strict'

var UserController = require('../controllers/user.controller');

module.exports = function(router){
    router.post('/login', function(req,res,next){ 
        UserController.login(req,res)
    });

    router.post('/signup', function(req,res,next){ 
        UserController.createUser(req,res)
    });

    //router.post('/revokeToken',)
}