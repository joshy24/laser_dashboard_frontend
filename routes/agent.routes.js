'use strict'

var AgentController = require('../controllers/agent.controller');
var AgentService = require('../services/agent.service');

module.exports = function(router){

    router.post('/add_agents', function(req,res,next){ 
        AgentController.addAgents(req,res)
    });

    router.post('/login_agent', function(req,res,next){ 
        AgentController.login(req,res)
    });

    router.post('/signup_agent', function(req,res,next){ 
        AgentController.createUser(req,res)
    });

    router.use(function(req,res,next){
        var token = "";
        
        token = req.headers.authorization; // in authorization header
        
        if(!token || token == null || token == undefined){
            token = req.query.name; // in query string of get request
           
            if(!token){
                token = req.body.token; // in body of post request
            }
        }
        else{
            token = token.split(':')[1];
        }
        
        if(!token){
            return res.status(400).send("Bad Request Token");
        }
        else{
            jwt.verify(token, config.secret, function(err, decodedPayload) {
                if (err) {
                  res.statusMessage = "Expired Token";
                  res.status(403).send();
                  //the token should be removed from users list of tokens

                  //on client side 403 should mean that the token has expired and the user should be forced to re-authenticate except during a game
                } else {
                  //still have to query db for full user profile and check if the token is present in the users list of tokens
                  AgentService.readAgent(decodedPayload.id)
                             .then(agent => {
                                if(agent){
                                    if(agent.tokens.includes(token)){
                                        req.agent = agent;
                                        next();
                                    }
                                    else{
                                        return res.status(400).send("Bad Request Token");
                                    }
                                }
                                else{
                                    return res.status(400).send("Bad Request Token");
                                }
                             })
                             .catch(err => {
                                return res.status(400).send("Bad Request Token");
                             })
                }
            });
        }
    });
}