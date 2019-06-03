'use strict'

var helmet = require('helmet');

const express = require('express');

const bluebird = require('bluebird')
const bodyParser = require('body-parser');
const cors = require('cors');
const bunyan = require('bunyan');

global.async = require('asyncawait/async');
global.await = require('asyncawait/await');

require('dotenv').config();
global.mongoose = require('mongoose');
mongoose.Promise = bluebird;

var app = express();
var router = express.Router();
global.config = require('./config/config');
global.jwt = require('jsonwebtoken');

global.log = bunyan.createLogger({name: "nifi"});

app.use(bodyParser.json({ type: 'application/json', limit: '50mb' }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));//accept strings, arrays and any other type as values

app.disable('x-powered-by');

app.options('*', cors({"origin": "*", //origin value to be changed in production to domain name
"methods": "GET,POST",
"preflightContinue": false,
"optionsSuccessStatus": 204}))

app.use(helmet({
    frameguard: {action: 'deny'}
}))

var all_routes = require('./routes/routes');

app.use('/api', all_routes);

//DB connection
const server = app.listen(config.port, function(){
    console.log("Express started on " +config.base_url +' in '+config.env +' environment. Press Ctrl + C to terminate');
    mongoose.connect(config.db.uri)
    .then(()=> { log.info(`Succesfully Connected to the Mongodb Database  at URL : `+config.db.uri)})
    .catch((error)=> { log.error(error)})
 });