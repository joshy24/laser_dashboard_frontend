'use strict'

var helmet = require('helmet');

const express = require('express');

const bluebird = require('bluebird')
const bodyParser = require('body-parser');
const cors = require('cors');
const bunyan = require('bunyan');
global.path = require('path');

global.async = require('asyncawait/async');
global.await = require('asyncawait/await');

require('dotenv').config();
global.mongoose = require('mongoose');
mongoose.Promise = bluebird;

var app = express();
var router = express.Router();
global.config = require('./config/config');
global.jwt = require('jsonwebtoken');

global.moment = require('moment')

global.log = bunyan.createLogger({name: "nifi"});

app.use(bodyParser.json({ type: 'application/json', limit: '50mb' }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));//accept strings, arrays and any other type as values

app.disable('x-powered-by');



/* The two block below of app.options and app.use are necessary for allowing CORS in development environment*/
app.options('*', cors({"origin": "*", //origin value to be changed in production to domain name
"methods": "GET,POST",
"preflightContinue": false,
"optionsSuccessStatus": 204}))

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
/* End of allowing CORS*/



app.use(helmet({
    frameguard: {action: 'deny'}
}))

var all_routes = require('./routes/routes');

app.use(express.static(path.join(__dirname, 'build')));

app.use('/api', all_routes);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.use(function(req, res, next) {
    // Instead of "*" you should enable only specific origins
    res.header('Access-Control-Allow-Origin', '*');
    // Supported HTTP verbs
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    // Other custom headers
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

//DB connection
const server = app.listen(config.port, function(){
    console.log("Express started on " +config.base_url +' in '+config.env +' environment. Press Ctrl + C to terminate');
    mongoose.connect(config.db.uri, config.db.options)
    .then(()=> { log.info(`Succesfully Connected to the Mongodb Database  at URL : `+config.db.uri)})
    .catch((error)=> { log.error(error)})
 });