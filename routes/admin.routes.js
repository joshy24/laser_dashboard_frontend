'use strict'

var AdminController = require('../controllers/admin.controller');

module.exports = function(router){
    router.post('/getLocations', function(req,res){
        AdminController.getLocations(req,res);
    });

    router.post('/getEmergencies', function(req,res){
        AdminController.getEmergencies(req,res);
    });
}