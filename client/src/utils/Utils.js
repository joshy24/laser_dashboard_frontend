import moment from 'moment';

export default class Util{
    getDate(str){
        var date = moment(str);
        var dateComponent = date.utc().format('YYYY - MM - DD');

        return dateComponent;
    }

    getTime(str){
        var date = moment(str);
        var timeComponent = date.utc().format('HH:mm:ss');

        return timeComponent;
    }

    sortDates(arr){
        arr.sort(function compare(a, b) {
            var dateA = new Date(a.created);
            var dateB = new Date(b.created);
            return dateA - dateB;
        });
          
        return arr;
    }

    //idle
    //infocus
    //using
    //using_by_other

    /*checkAgentState(agent, monitoring_grid, browser_admin_id, agents_in_focus, laser_agents){
        return new Promise((resolve, reject) => {
            const id = agent.agent._id;

            monitoring_grid.map(row => {
                if(row){
                    //Object.keys(row)[0] - this gives us the admin id
                    //row[Object.keys(row)[0]];- this gives us the admin content ({user: ...., agents: [...]})

                    var admin_content = row[Object.keys(row)[0]];
                    var admin_id = Object.keys(row)[0];

                    var agent_found_in_admin = false;

                    admin_content.agents.map( (agent_id, index)  => {
                        if(id===agent_id){
                            agent_found_in_admin = true;
                            //check if its the browsers admin that is using the agent
                            if(admin_id===browser_admin_id){
                                //set the status
                                Object.assign(agent.agent, {status: "using"});
                            }
                            else{
                                //its not the browsers admin that is using the agent, its another admin
                                Object.assign(agent.agent, {status: "using_by_other"});
                            }

                            //replace the agent in the list of agents
                            var new_laser_agents = laser_agents.map(laser_agent => {
                                if(laser_agent.agent._id === id){
                                    return agent;
                                }
                                else{
                                    return laser_agent;
                                }
                            })

                            resolve(new_laser_agents);
                        }

                        if(index === (admin_content.agents.length-1)){
                            //last index
                            //if we get here it means the agent was not found in one of the admins agents array
                            //we check if the agent was found in the agents_in_focus  array

                            var found_agent_in_focus_array = false

                            agents_in_focus.map((agent_in_focus_id, ind) => {
                                if(id === agent_in_focus_id){
                                    Object.assign(agent, {status: "infocus"});
                                    found_agent_in_focus_array = true;
                                }

                                if(ind === (agents_in_focus.length - 1)){ //this is the last index
                                    if(!found_agent_in_focus_array){
                                        //the agent was not found in the agents in focus array
                                        Object.assign(agent.agent, {status: "idle"});
                                    }

                                    var new_laser_agents = laser_agents.map(laser_agent => {
                                        if(laser_agent.agent._id === id){
                                            return agent;
                                        }
                                        else{
                                            return laser_agent;
                                        }
                                    })
            
                                    resolve(new_laser_agents);
                                }
                            })
                        }
                    })
                }
                else{
                    //the monitoring grid is possibly empty
                }
            });
        })
    }*/

    //All we are doing here is updting the location while inheriting the status
    updateAgentLocation(agent, laser_agents, monitoring_grid, browser_admin_id){
        return new Promise((resolve, reject) => {
            parseLaserAgents(agent, laser_agents, monitoring_grid, browser_admin_id)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    })
        })
    }

    checkIfEmergencyMonitoredByOtherAdmin(monitoring_grid, emergency, browser_admin_id){
        return new Promise((resolve, reject) => {
            var found = false;
            if(monitoring_grid && monitoring_grid.length > 0){
                monitoring_grid.map((row, index) => {
                    if(row){
                        if(row.admin_id !== browser_admin_id){
                            if(row.emergency._id === emergency._id){
                                found = true;
                            }
                        }
    
                        if(index === (monitoring_grid.length - 1)){
                            resolve(found);
                        }
                    }
                })
            }
            else{
                resolve(found);
            }
        })
    }

    setEmergencyOnMonitoringGrid(emergency, monitoring_grid, admin_id){ //to return a fresh monitoring grid
        return new Promise((resolve,reject) => {
            var found = false;

            if(monitoring_grid && monitoring_grid.length > 0 ){
                
                var new_monitoring_grid = [];

                monitoring_grid.map((row, index) => {
                    if(row){
                        
                        if(row.admin_id === admin_id){
                            found = true;

                            row = {admin_id: admin_id, emergency: emergency, agents: row.agents};

                            new_monitoring_grid.push(row);
                        }
                        else{
                            new_monitoring_grid.push(row);
                        }
                        
                        if(index === (monitoring_grid.length - 1)){
                            if(!found){
                                new_monitoring_grid.push({admin_id:admin_id, emergency: emergency, agents: []});
                            }
                            //we are at the final index
                            resolve(new_monitoring_grid);
                        }
                    }
                })
            }
            else{
                monitoring_grid.push({admin_id: admin_id, emergency: emergency, agents: []});
                
                resolve(monitoring_grid);
            }
        })
    }

    setAgentOnMonitoringGridAndChangeAgentStatus(agent, monitoring_grid, admin_id, laser_agents){ //to return a fresh monitoring grid
        return new Promise((resolve,reject) => {
            var found = false;
            
            if(monitoring_grid.length > 0 ){
                
                var new_monitoring_grid = [];

                monitoring_grid.map((row, index) => {
                    if(row){
                        if(row.admin_id === admin_id){
                            found = true;

                            if(row.agents.indexOf(agent.agent._id)===-1){
                                //the agents id does not exist in the list of agents, so we add it
                                row.agents.push(agent.agent._id);
                            }

                            new_monitoring_grid.push(row);
                        }
                        else{
                            new_monitoring_grid.push(row);
                        }
                        
                        if(index === (monitoring_grid.length - 1)){
                            //we are at the final index
                            //we change the status of the agent on the laser_agents array and return the laser_agents array as well
                            for(var i = 0; i < laser_agents.length; i++){
                                if(laser_agents[i].agent._id === agent.agent._id){
                                    //we have found the agent to update
                                    laser_agents[i].status = "using";
                                    break;
                                }
                            }
                           
                            resolve([new_monitoring_grid, laser_agents]);
                        }
                    }
                })
            }
            else{
                resolve(monitoring_grid, laser_agents);
            }
        })
    }

    checkIfEmergencyMonitoredByBrowserAdmin(browser_admin_id, monitoring_grid){
        //here we are just checking if the browser admin is actually monitoring an emergency

        return new Promise((resolve,reject) => {
            var monitoring = false;

            if(monitoring_grid.length > 0){
                monitoring_grid.map((row, index) => {
                    if(row){
                        if(row.admin_id === browser_admin_id){
                            if(row.emergency){
                                //yes we are monitoring an emergency
                                monitoring = true;
                            }
                        }
                        
                        if(index === (monitoring_grid.length - 1)){
                            //we are at the final index
                            resolve(monitoring);
                        }
                    }
                });
            }
            else{
                resolve(monitoring);
            }
        })
    }

    setAgentsInFocus(agents_in_focus, emergency, laser_agents){
        return new Promise((resolve,reject) => {

            var new_laser_agents = [];

            laser_agents.map((agent,index) => {
                
                if(agent.sub_admin_address && emergency.sub_admin_address && (agent.sub_admin_address === emergency.sub_admin_address)){
                    //the agent is in the same subadmin address as the emergency
                    //we check if the agent is being used by the current admin or anothe admin
                    if(agent.status !== "using" && agent.status !== "using_by_other"){
                        agent.status = "infocus"
                    }

                    if(agents_in_focus.indexOf(agent.agent._id)===-1){
                        //agent is not in agents_in_focus array
                        agents_in_focus.push(agent.agent._id);
                    }

                    new_laser_agents.push(agent);
                    
                }
                else{
                    new_laser_agents.push(agent);
                }
                
                if(index === (laser_agents.length-1)){
                    //last index
                    resolve([new_laser_agents, agents_in_focus]);
                }
            })
        })
    }

    checkIfOtherAdminIsUsingAgent(browser_admin_id, agent, monitoring_grid){
        return new Promise((resolve,reject) => {
            var found = false;
    
            if(monitoring_grid.length > 0){
                for(var index = 0; index< monitoring_grid.length; index++){
                    var row = monitoring_grid[0];
    
                    if(row){
                        if(row.admin_id !== browser_admin_id){
                            if(row.agents.indexOf(agent.agent._id) !== -1){
                                found = true;
    
                                resolve(found);
    
                                break;
                            }
                        }
                        
                        if(index === (monitoring_grid.length - 1)){
                            resolve(found);
                        }
                    }
                }
            }
            else{
                resolve(found);
            }
        })
    }

    getAdminEmergencyMonitored(browser_admin_id, monitoring_grid){
        return new Promise((resolve,reject) => {
            if(monitoring_grid.length > 0){
                
                for(var index = 0; index < monitoring_grid.length; index++){
                    var row = monitoring_grid[index];
    
                    if(row){
                        if(row.admin_id === browser_admin_id){
                            resolve(row);
                            break;
                        }
                        
                        if(index === (monitoring_grid.length - 1)){
                            resolve(null);
                        }
                    }
                }
            }
            else{
                resolve(null);
            }
        })
    }

    addAgentToListOfAssignedAgentsForPersistence(agent, assigned_agents_array){
        if(assigned_agents_array && assigned_agents_array.length > 0 ){
            var found  = false;

            assigned_agents_array.map( (assigned_agent, index) => {
                if(assigned_agent.agent._id === agent.agent._id){
                    found = true;

                    assigned_agents_array.splice(index, 1, agent);
                }
            })

            if(!found){
                assigned_agents_array.push(agent);
            }
        }
        else{
            assigned_agents_array = [];
            assigned_agents_array.push(agent);
        }

        return assigned_agents_array;
    }

    removeAgentFromListOfAssignedAgentsForPersistsnce(agent, assigned_agents_array){
        if(assigned_agents_array && assigned_agents_array.length > 0 ){
            assigned_agents_array.map( (assigned_agent, index) => {
                if(assigned_agent.agent._id === agent.agent._id){
                    assigned_agents_array.splice(index, 1);
                }
            })

        }
        else{
            assigned_agents_array = [];
            assigned_agents_array.push(agent);
        }

        return assigned_agents_array;
    }

    reconcileAssignedAgentsListWithMonitoringGrid(browser_admin_id, assigned_agents_array, monitoring_grid){
        return new Promise((resolve,reject) => {
            var laser_agents = [];

            if(monitoring_grid.length > 0){
                var monitoring_grid_agents_list;
                var new_assigned_agents_array = [];

                for(var i = 0; i < monitoring_grid.length; i++){
                    if(monitoring_grid[i].admin_id === browser_admin_id){
                        monitoring_grid_agents_list = monitoring_grid[i].agents.concat([])
                        break;
                    }
                }
               
                //we have our agents from the monitoring grid
                if(monitoring_grid_agents_list && monitoring_grid_agents_list.length > 0){
                    //there are agents in the monitoring grid for the admin, meaning agents were assigned
                    assigned_agents_array.map(assigned_agent => {
                        if(monitoring_grid_agents_list.indexOf(assigned_agent.agent._id) !== -1){
                            //means the assigned agent is present in the monitoring grid. The agent is good to proceed into the laser_agents array
                            laser_agents.push(assigned_agent);
                            new_assigned_agents_array.push(assigned_agent);
                        }
                    })

                    resolve([new_assigned_agents_array, laser_agents])
                }
                else{
                    laser_agents = [];

                    resolve([new_assigned_agents_array, laser_agents]);
                }
            }
            else{
                resolve([assigned_agents_array, laser_agents])
            }
        })
    }


    reconcileAllAgentsWithMonitoringGrid(laser_agents, monitoring_grid, browser_admin_id){
        return new Promise((resolve,reject) => {
            var new_laser_agents = [];

            if(laser_agents.length > 0){
                laser_agents.map((laser_agent, index) => {
                    checkWhoIsUsingTheAgent(browser_admin_id, laser_agent, monitoring_grid)
                            .then(who => {
                                var new_agent = Object.assign(laser_agent, {status:who});

                                new_laser_agents.push(new_agent);

                                if(index === (laser_agents.length - 1)){
                                    resolve(new_laser_agents);
                                }
                            })
                            .catch(err => {
                                new_laser_agents.push(laser_agent);

                                if(index === (laser_agents.length - 1)){
                                    resolve(new_laser_agents);
                                }
                            })
                })
            }
            else{
                resolve([]);
            }
        })
    }

    removeAgentFromBrowserAdminMonitoringGrid(agent, browser_admin_id, monitoring_grid, laser_agents){
        return new Promise((resolve,reject) => {
            if(monitoring_grid.length > 0){
                var new_monitoring_grid = [];

                for(var i = 0; i < monitoring_grid.length; i++){
                    if(monitoring_grid[i].admin_id === browser_admin_id){
                        if(monitoring_grid[i].agents.indexOf(agent.agent._id) !== -1){
                            monitoring_grid[i].agents.splice(monitoring_grid[i].agents.indexOf(agent.agent._id),1);
                        }

                        new_monitoring_grid.push(monitoring_grid[i]);

                        if(laser_agents.length > 0){
                            for(var j = 0; j < laser_agents.length; j++){
                                if(laser_agents[j].agent._id === agent.agent._id){
                                    agent.status = "idle"
                                    laser_agents.splice(j, 1, agent);
                                    break;
                                }
                            }
                        }
                    }
                    else{
                        new_monitoring_grid.push(monitoring_grid[i]);
                    }

                    if(i === (monitoring_grid.length - 1)){
                        resolve([new_monitoring_grid, laser_agents]);
                    }
                }
               
            }
            else{
                resolve([monitoring_grid, laser_agents]);
            }
        })
    }

    getAgentFromAssignedAgentsInPersistence(assigned_agents_list, agent_id){
        return new Promise((resolve, reject) => {
            for(var i = 0; i < assigned_agents_list.length; i++){
                if(assigned_agents_list[i].agent._id === agent_id){
                    resolve(assigned_agents_list[i]);
                    break;
                }
            }

            resolve(null);
        })
    }

}

function parseLaserAgents(agent, laser_agents, monitoring_grid, browser_admin_id){
    return new Promise((resolve, reject) =>{
        var agent_found = false;

        var new_laser_agents = [];

        if(laser_agents.length === 0){

            checkWhoIsUsingTheAgent(browser_admin_id, agent, monitoring_grid)
                        .then(stat => {
                            var new_agent = Object.assign(agent, {status: stat});
    
                            new_laser_agents.push(new_agent);

                            resolve(new_laser_agents);
                        })
                        .catch(err => {
                            var new_agent = Object.assign(agent, {status: "idle"});
    
                            new_laser_agents.push(new_agent);

                            resolve(new_laser_agents);
                        })
        }
        else{
            laser_agents.map((laser_agent,index) => {
                if(laser_agent.agent._id === agent.agent._id){
                    agent_found = true;
    
                    var new_agent = Object.assign(agent, {status:laser_agent.status}); //inherit the status
    
                    new_laser_agents.push(new_agent);
                }
                else{
                    new_laser_agents.push(laser_agent);
                }
    
                if(index === (laser_agents.length-1)){
                    //we are on the last index
                    
                    if(agent_found){
                        checkWhoIsUsingTheAgent(browser_admin_id, agent, monitoring_grid)
                                .then(stat => {
                                    var new_agent = Object.assign(agent, {status: stat});
            
                                    new_laser_agents.push(new_agent);

                                    resolve(new_laser_agents);
                                })
                                .catch(err => {
                                    var new_agent = Object.assign(agent, {status: "idle"});
            
                                    new_laser_agents.push(new_agent);

                                    resolve(new_laser_agents);
                                })
                    }
                    else{
                        resolve(new_laser_agents)
                    }
                }
            })
        }
    })
}

function checkWhoIsUsingTheAgent(browser_admin_id, agent, monitoring_grid){
    return new Promise((resolve, reject) => {
        var status = "idle";
        if(monitoring_grid.length > 0){
            for(var index = 0; index < monitoring_grid.length; index++){
                var row = monitoring_grid[index];

                if(row){
                    if(row.admin_id === browser_admin_id){
                        //admins row
                        if(row.agents.indexOf(agent.agent._id) !== -1){
                            resolve("using")
                            break;
                        }
                    }
                    else{
                        //other admins row
                        if(row.agents.indexOf(agent.agent._id) !== -1){
                            resolve("using_by_other");
                            break;
                        }
                    }

                    if(index === (monitoring_grid.length - 1)){
                        resolve(status);
                    }
                }
            }
        }
        else{
            resolve(status);
        }
    })
}
