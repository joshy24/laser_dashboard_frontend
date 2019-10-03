'use strict'

var AdminController = require('../controllers/admin.controller');
var AgentController = require('../controllers/agent.controller');
var AdminService = require('../services/admin.service');

module.exports = function(router){

    router.post('/login', (req,res) => {
        AdminController.login(req,res);
    })
    
    router.post('/create_agents', (req,res) => {
        AgentController.addAgents(req,res);
    })

    router.post('/create_admin', (req,res) => {
        AdminController.createAdmin(req,res);
    })

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
                  AdminService.readAdmin(decodedPayload.id)
                             .then(admin => {
                                if(admin){
                                    if(admin.tokens.includes(token)){
                                        req.admin = admin;
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

    router.post('/getLocations', function(req,res){
        AdminController.getLocations(req,res);
    });

    router.post('/getEmergencies', function(req,res){
        AdminController.getEmergencies(req,res);
    });

    //unauthorized access check
    router.use((req,res,next) => {
        if(req.admin.priviledge==="full_control"){
            next()
        }
        else{
            return res.status(503).send("You are not Authorized");
        }
    })

    router.post('/resolveEmergency', (req,res) => {
        AdminController.resolveEmergency(req,res);
    })

    router.post('/resolveCall', (req,res) => {
        AdminController.resolveCall(req,res);
    })

    router.post('/create_department', (req,res) => {
        AdminController.createDepartment(req,res);
    })

    router.post('/edit_department', (req,res) => {
        AdminController.editDepartment(req,res);
    })

    router.post('/get_departments', (req,res) => {
        AdminController.getDepartments(req,res);
    })

    router.post('/delete_department', (req,res) => {
        AdminController.deleteDepartment(req,res);
    })
    
    router.post('/create_agent', (req,res) => {
        AgentController.createAgent(req,res);
    })

    router.post('/edit_agent', (req,res) => {
        AgentController.editAgent(req,res);
    })

    router.post('/delete_agent', (req,res) => {
        AgentController.deleteAgent(req,res);
    })

    router.post('/get_agents', (req,res) => {
        AgentController.getAgents(req,res);
    })

    router.post('/get_agents_department', (req,res) => {
        AgentController.getAgentsDepartment(req,res);
    })
}