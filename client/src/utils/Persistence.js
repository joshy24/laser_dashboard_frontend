
export default class Persistence{
    saveAssignedAgents(selected_agents){
        localStorage.setItem("assigned_agents", JSON.stringify(selected_agents));
    }

    getAssignedAgents(){
        return JSON.parse(localStorage.getItem("assigned_agents"));
    }

    deleteAssignedAgents(){
        localStorage.removeItem("assigned_agents");
    }

    saveCompletedEmergenciesResponse(all_responses){
        localStorage.setItem("route_completed", JSON.stringify(all_responses));
    }

    getCompletedEmergenciesResponse(){
        return JSON.parse(localStorage.getItem("route_completed"));
    }
}