'use strict'

//initialize
var express = require('express');
var router = express.Router();

//modules
require('./admin.routes')(router);
require('./auth.routes')(router);
require('./user.routes')(router);

//export
module.exports = router;