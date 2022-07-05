'use strict'

const helmet = require('helmet');

const express = require('express');

const bluebird = require('bluebird')
const bodyParser = require('body-parser');
const cors = require('cors');
const bunyan = require('bunyan');

const client =  require("./modules/redis.config")
global.client;

global.path = require('path');

require('dotenv').config();
global.mongoose = require('mongoose');
mongoose.Promise = bluebird;

const app = express();
const router = express.Router();
global.config = require('./config/config');
global.jwt = require('jsonwebtoken');

global.moment = require('moment');

global.log = bunyan.createLogger({name: "laser"});

app.use(bodyParser.json({ type: 'application/json', limit: '50mb' }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));//accept strings, arrays and any other type as values

app.disable('x-powered-by');




var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
 
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: config.google_api_key, // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};

global.geocoder = NodeGeocoder(options);




/* Start of socket-io stuff*/

var http = require('http').createServer(app);

//const { Server } = require("socket.io");
//const io = new Server(http);

global.io = require('socket.io')(http, {
    cors: {
        origin: "*",
        //credentials: true,
        methods: ["GET", "POST"],
    }
});

io.on("connection", socket => {
    console.log("New client connected");

    //A special namespace "disconnect" for when a client disconnects
    socket.on("disconnect", () => console.log("Client disconnected"));
});

http.listen(config.socket.port, () => console.log(`Socket IO listening on port ${config.socket.port}`));

/* End of socket-io stuff*/





/* The two blocks below of app.options and app.use are necessary for allowing CORS in development environment*/
app.options('*', cors({"origin": "*", //origin value to be changed in production to domain name
"methods": "GET,POST",
"preflightContinue": false,
"optionsSuccessStatus": 204}))

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
/* End of allowing CORS*/




app.use(helmet({
    frameguard: {action: 'deny'},
}))


var all_routes = require('./routes/routes');

app.use('/api', all_routes);


var agent_routes = require('./routes/agent')

app.use('/agent', agent_routes);


var admin_routes = require('./routes/admin')

app.use('/admin', admin_routes);


app.use(express.static(path.join(__dirname, 'build')));

// Send all other requests to the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

const PORT = process.env.PORT || 3077;


//DB connection
const server = app.listen(PORT, function(){
    console.log("Express started on " +config.base_url +' in '+config.env +' environment. Press Ctrl + C to terminate');
    mongoose.connect(config.db.uri , config.db.options)
    .then(()=> { log.info(`Succesfully Connected to the Mongodb Database`)})
    .catch((error)=> { log.error(error)})
});