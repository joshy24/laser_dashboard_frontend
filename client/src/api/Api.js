
//Our Auth Service
import AuthHelperMethods from '../auth/AuthHelperMethods';

const Auth = new AuthHelperMethods();

const Axios = Auth.axios;

const locations_url = "/getLocations";
const emergencies_url = "/getEmergencies";
const resolve_emergenciy_url = "/resolveEmergency";
const resolve_location_url = "/resolveCall";

const createAgentUrl = "/create_agent";
const editAgentUrl = "/edit_agent";
const deleteAgentUrl = "/delete_agent";
const getAgentsUrl = "/get_agents";
const getAgentsDepartmentUrl = "/get_agents_departments";

const createDepartmentUrl = "/create_department";
const editDepartmentUrl = "/edit_department";
const deleteDepartmentUrl = "/delete_department";
const getDepartmentsUrl = "/get_departments";

const createAdminUrl = "/create_admin";
const editAdminUrl = "/edit_admin";
const deleteAdminUrl = "/delete_admin";
const getAdminsUrl = "/get_admins";

const createManualLocationUrl = "/create_manual_location";

const saveMonitoringGridUrl = "/setMonitorings";
const getMonitoringGridUrl = "/getMonitorings";

export const createManualLocation = (data) => {
    return  Axios(createManualLocationUrl, data)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    console.log({err});
                    return "error";
                })
}

export const getLocations = (data) => {
    return  Axios(locations_url, data)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    console.log({err});
                    return "error";
                })
}

export const getEmergencies = (data) => {
    return  Axios(emergencies_url, data)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    console.log({err});
                    return "error";
                })
}

export const resolveLocation = (id) => {
    return  Axios(resolve_location_url, id)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    console.log({err});
                    return "error";
                })
}

export const resolveEmergency = (data) => {
    return  Axios(resolve_emergenciy_url, data)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    console.log({err});
                    return "error";
                })
}

export const getAgents = () => {
    return  Axios(getAgentsUrl)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    console.log({err});
                    return "error";
                })
}

export const getAgentsDepartment = (department) => {
    return  Axios(getAgentsDepartmentUrl, {department})
                .then(res => {
                    return res;
                })
                .catch(err => {
                    console.log({err});
                    return "error";
                })
}

export const createAgent = (data) => {
    return Axios(createAgentUrl, data)
            .then(res => {
                return res;
            })
            .catch(err => {
                console.log(err);
                return "error";
            })
}

export const editAgent = (data) => {
    return Axios(editAgentUrl, data)
            .then(res => {
                return res;
            })
            .catch(err => {
                console.log(err);
                return "error";
            })
}

export const deleteAgent = (id) => {
    return Axios(deleteAgentUrl, {id})
            .then(res => {
                return res;
            })
            .catch(err => {
                console.log(err);
                return "error";
            })
}

export const getDepartments = () => {
    return  Axios(getDepartmentsUrl)
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return "error";
                })
}

export const createDepartment = (name) => {
    return Axios(createDepartmentUrl, {name})
            .then(res => {
                return res;
            })
            .catch(err => {
                return "error";
            })
}

export const editDepartment = (data) => {
    return Axios(editDepartmentUrl, data)
            .then(res => {
                return res;
            })
            .catch(err => {
                return "error";
            })
}

export const deleteDepartment = (id) => {
    return Axios(deleteDepartmentUrl, {id})
            .then(res => {
                return res;
            })
            .catch(err => {
                return "error";
            })
}



//admin routes
export const getAdmins = (count) => {
    return  Axios(getAdminsUrl, {count})
                .then(res => {
                    return res;
                })
                .catch(err => {
                    return "error";
                })
}

export const createAdmin = (name) => {
    return Axios(createAdminUrl, {name})
            .then(res => {
                return res;
            })
            .catch(err => {
                return "error";
            })
}

export const editAdmin = (data) => {
    return Axios(editAdminUrl, data)
            .then(res => {
                return res;
            })
            .catch(err => {
                return "error";
            })
}

export const deleteAdmin = (id) => {
    return Axios(deleteAdminUrl, {id})
            .then(res => {
                return res;
            })
            .catch(err => {
                return "error";
            })
}

export const saveMonitoringGrid = (monitoring_grid) => {
    return Axios(saveMonitoringGridUrl, {monitorings:monitoring_grid})
            .then(res => {
                return res;
            })
            .catch(err => {
                return "error";
            })
}

export const getMonitoringGrid = () => {
    return Axios(getMonitoringGridUrl, {}, "get")
            .then(res => {
                return res;
            })
            .catch(err => {
                return "error";
            })
}