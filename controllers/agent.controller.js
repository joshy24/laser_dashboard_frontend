'use strict'

var Utils = require('../modules/utils');
var AgentService = require('../services/agent.service');

module.exports.loginAgent = function(req,res){
    var password = req.body.password
    var phone_number  = req.body.phone_number;

    if(!password){
        return res.status(400).send({"response":"bad request"});
    }

    if(!phone){
        return res.status(400).send({"response":"bad request"});
    }

    var new_number = Utils.parsePhoneNumber(phone);

    if(new_number==null){
        return res.status(400).send("Incomplete Number");
    }

    AgentService.readAgentPhoneNumber(new_number)
        .then(agent => {
            if(!agent){
                return res.status(404).send({"response": "not found"});
            }
            else{
                agent.comparePassword(password)
                .then(confirmation => {
                    if(confirmation==true){
                        var token = jwt.sign({id:agent._id, firstname: agent.firstname, lastname:agent.lastname}, config.secret, {issuer: "Laser", audience: "Agent", expiresIn: 60*60*24*500, algorithm: "HS256"});
                        agent.tokens.push(token);
                        AgentService.updateAgent(agent._id, agent)
                                .then(updated_agent => {
                                        if(updated_agent){
                                            agent.tokens = null;
                                            agent.phone_number = null;
                                            return res.status(200).send({"agent":agent, "token":token});
                                        }
                                        else{
                                            console.log("couldnt update");
                                            return res.status(500).send("Server Error");
                                        }
                                })
                                .catch(err => {
                                    console.log(err.message);
                                    return res.status(400).send("Error");
                                })
                    }
                    else{
                        return res.status(400).send("Wrong Password");
                    }
                })
                .catch(err => {
                    console.log(err.message);
                    return res.status(400).send("Password Error");
                })
            }
        })
        .catch(err => {
                console.log(err.message);
                return res.status(500).send("Server Error");
        })
}

module.exports.registerAgent = function(req,res){
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var phone_number  = req.body.phone_number;
    var agency = req.body.agency;
    var password = req.body.password

    if(!firstname||!lastname||!agency){ 
        return res.status(400).send({"response":"bad request"});
    }

    if(!password||password.length<8){
        return res.status(400).send({"response":"bad request"});
    }

    if(!phone_number){
        return res.status(400).send({"response":"bad request"});
    }

    var new_number = Utils.parsePhoneNumber(phone_number);

    if(new_number==null){
        return res.status(400).send("Incomplete Number");
    }
    
    var agent_obj = {
        lastname: lastname,
        firstname: firstname,
        phone_number: new_number,
        password: password,
        agency: agency
    }

    AgentService.readAgentPhoneNumber(new_number)
        .then(agent => {
            if(!agent||agent==null){
                AgentService.saveAgent(agent_obj)
                    .then(agent => {
                        var token = jwt.sign({id:agent._id, firstname: agent.firstname, lastname: agent.lastname}, config.secret, {issuer: "Laser", audience: "Agents", expiresIn: 60*60*24*5, algorithm: "HS256"});
                        agent.tokens = [];
                        agent.tokens.push(token);

                        AgentService.updateAgent(agent._id, agent)
                                .then(updated_agent => {
                                        agent.tokens = null;
                                        agent.password = null;
                                        agent.phone_number = null;
                                        return res.status(200).send({"agent":agent, "token":token});
                                })
                                .catch(err => {
                                        console.log(err.message);
                                        return res.status(500).send("Server Error");
                                })
                    })
                    .catch(err =>{

                    })
            }
            else{
                res.statusMessage = "Agent Exists";
                return res.status(500).send();
            }
        })
        .catch(err => {
                console.log(err.message);
                return res.status(500).send("Server Error");
        })

}