var Utils = require('../modules/utils');
var AgentService = require('../services/agent.service');
var bcrypt = require('bcryptjs');

module.exports.addAgents = function(req,res){
    var new_agent = {
        firstname: "Simon",
        lastname: "Peter",
        phone_number: '08033333333',
        password: "password24",
        department: "police"
    }

    addAgent(new_agent);

    var new_agent1 = {
        firstname: "David",
        lastname: "Johnson",
        phone_number: '08022222222',
        password: "password24",
        department: "fire"
    }

    addAgent(new_agent1);

    var new_agent2 = {
        firstname: "Moses",
        lastname: "Kelly",
        phone_number: '08011111111',
        password: "password24",
        department: "hospital"
    }

    addAgent(new_agent2);

    return res.status(200).send({"response":"successfully added"});
}


function addAgent(agent_obj){

    var new_number = Utils.parsePhoneNumber(agent_obj.phone_number);

    if(new_number==null){
        console.log("Incomplete Number");
    }

    AgentService.readAgentPhoneNumber(new_number)
        .then(agent => {
            if(agent){
                console.log({"response": "user with phone number exits"});
            }
            else{
                agent_obj.phone_number = new_number;

                AgentService.saveAgent(agent_obj)
                    .then(agent => {
                        console.log({"response":"successfully added"});
                    })
                    .catch(err =>{
                        console.log({err});
                    })
            }
        })
        .catch(err => {
            console.log({err});
        })
}

module.exports.loginAgent = function(req,res){
    var password = req.body.password
    var phone  = req.body.phone_number;

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
                                            agent.password = null;
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




//Agent Functions

module.exports.createAgent = function(req,res){
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var phone_number  = req.body.phone_number;
    var department = req.body.department;
    var password = req.body.password

    if(!firstname||!lastname||!department){ 
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
        department: department
    }

    AgentService.readAgentPhoneNumber(new_number)
        .then(agent => {
            if(!agent||agent==null){
                AgentService.saveAgent(agent_obj)
                    .then(agent => {
                        return res.status(200).send({"agent":agent});
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

module.exports.editAgent = (req,res) => {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var phone_number  = req.body.phone_number;
    var agency = req.body.agency;
    var password = req.body.password

    const id = req.body.id;

    if(!firstname||!lastname||!agency){ 
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

    AgentService.readAgent(id)
                .then(agent => {
                    if(agent){
                        AgentService.updateAgent(id, agent_obj)
                                .then(updated_agent => {
                                    return res.status(200).send(updated_agent);
                                })
                                .catch(err => {
                                    return res.status(500).send("error");
                                })
                    }
                    else{
                        return res.status(404).send("not found");
                    }
                })
                .catch(err => {
                    return res.status(500).send("error");
                })
}

module.exports.getAgents = (req,res) => {
    AgentService.readAllAgents()
                    .then(agents => {
                        return res.status(200).send(agents);
                    })
                    .catch(err => {
                        return res.status(500).send("error");
                    })
}

module.exports.getAgentsDepartment = (req,res) => {
    const department = req.body.department;

    if(!department){
        return res.status(400).send("bad request");
    }

    AgentService.readAllAgentsDepartment(department)
                    .then(agents => {
                        return res.status(200).send(agents);
                    })
                    .catch(err => {
                        return res.status(500).send("error");
                    })
}

module.exports.deleteAgent = (req,res) => {
    const id = req.body.id;

    if(!id){
        return res.status(400).send("bad request");
    }

    AgentService.deleteAgent(id)
                    .then(done => {
                        return res.status(200).send();
                    })
                    .catch(err => {
                        return res.status(500).send("error");
                    })
}