'use strict'

//initialize
var express = require('express');
var router = express.Router();

//modules
require('./agent.routes')(router);

//export
module.exports = router;