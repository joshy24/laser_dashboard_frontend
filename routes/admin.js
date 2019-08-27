'use strict'

//initialize
var express = require('express');
var router = express.Router();

//modules
require('./admin.routes')(router);

//export
module.exports = router;