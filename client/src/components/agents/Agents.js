import React, {Component} from "react";

import Agent from "./Agent"
import { Link } from 'react-router-dom'
import AddAgent from "./AddAgent"
import EditAgent from "./EditAgent"
import ConfirmAction from '../ConfirmAction';
import Loader from '../../components/Loader';

import * as API from '../../api/Api';

const controls_style = {
    marginLeft:"8px",
    marginRight: "8px"
}

export default class Agents extends Component {
    constructor(props){
        super(props)

        this.state = {
            agents: [],
            departments: [],
            agents_filter: [],
            selected_department: "",
            selected_agent: {},
            showConfirm: false,
            showAddAgent: false,
            showDeleteAgent: false,
            showEditAgent: false,
            confirmMessage: "",
            isLoading: false
        }

        this.getAgents = this.getAgents.bind(this);
        this.getAgentsDepartment = this.getAgentsDepartment.bind(this);
        this.getDepartments = this.getDepartments.bind(this);
        this.deleteAgent = this.deleteAgent.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.closeModalGetAgents = this.closeModalGetAgents.bind(this);
        this.showDeleteAgent = this.showDeleteAgent.bind(this);
        this.showAddAgent = this.showAddAgent.bind(this);
        this.showEditAgent = this.showEditAgent.bind(this);
        this.onDepartmentChanged = this.onDepartmentChanged.bind(this);
        this.showLoading = this.showLoading.bind(this);
        this.hideLoading = this.hideLoading.bind(this);
    }

    showLoading(){
        this.setState({
            isLoading: true
        })
    }

    hideLoading(){
        this.setState({
            isLoading: false
        })
    }

    async getAgents(){
        this.showLoading();

        const response = await(API.getAgents());

        this.hideLoading();

        if(response==="error"){
            //show error message
            return;
        }

        if(response && response.data && response.data.length > 0){
            this.setState({
                agents: response.data
            })
        }
    }

    async getAgentsDepartment(filter){
        this.showLoading();

        const response = await(API.getAgentsDepartment(filter));

        this.hideLoading();

        if(response==="error"){
            //show error message
            return;
        }

        if(response && response.data && response.data.length > 0){
            this.setState({
                agents: response.data
            })
        }
    }

    async getDepartments(){
        this.showLoading();

        const response = await(API.getDepartments());

        this.hideLoading();

        if(response==="error"){
            //show error message
            return;
        }

        if(response && response.data && response.data.length > 0){
            this.setState(state => {
                var deps = ["All"];

                response.data.map(dep => {
                    deps.push(dep.name);
                })
                
                return {
                    departments: deps
                }
            })
        }
    }

    async deleteAgent(agent){
        this.showLoading();
        
        const response = await(API.deleteAgent(this.state.selected_agent._id));

        this.hideLoading();

        if(response==="error"){
            //show error message
            return;
        }

        if(response && response.data){
            this.closeModal();
            this.setState(state => {
                var agents = state.agents;

                agents.splice(agents.indexOf(state.selected_agent),1);

                return {
                    agents: agents,
                    selected_agent: {}
                }
            })
        }
    }

    closeModal(){
        this.setState({
            showConfirm: false,
            showAddAgent: false,
            showDeleteAgent: false,
            showEditAgent: false
        })
    }

    closeModalGetAgents(){
        this.setState({
            showConfirm: false,
            showAddAgent: false,
            showDeleteAgent: false,
            showEditAgent: false
        });
        
        this.getAgents();
    }

    showDeleteAgent(e,agent){
        e.preventDefault();
        this.setState({
            selected_agent: agent,
            showDeleteAgent: true,
            confirmMessage: "Are you sure you want to delete agent " +agent.firstname +"'s profile? This cant be undone."
        })
    }

    showAddAgent(){
        this.setState({
            showAddAgent:  true
        })
    }

    showEditAgent(e,agent){
        e.preventDefault();
        this.setState({
            showEditAgent:  true,
            selected_agent: agent
        })
    }

    onDepartmentChanged(event){
        const target = event.target;
        const value = target.value;

        this.setState({
            selected_department: value
        })

        if(value==="All"){
            this.getAgents();
        }
        else{
            this.getAgentsDepartment(value);
        }
    }

    componentDidMount(){
        this.getAgents();
        this.getDepartments();
    }

    render(){
        return (
            <div className="laser-parent-div">
                <div className="laser-top-panel">
                    <h4 className="laser-inline">Laser Emergency Admin - Agents</h4>
                    <div className="laser-controls">
                        <Link style={controls_style} to={'/'} className="nav-link white-text link laser-inline laser-150-width">
                            <button className="laserbtn laser-white_border-blue-bg">View Map</button>
                        </Link>

                        <select style={controls_style} className="form-control laser-inline laser-150-width" id="filter" name="filter" value={this.state.selected_department} onChange={this.onDepartmentChanged}>
                            {
                                this.state.departments.map(dep => {
                                    return <option>{dep}</option>
                                })
                            }
                        </select>
                        <button onClick={this.showAddAgent} style={controls_style} className="laser-inline laser-100-width laserbtn laser-white_border-blue-bg">Add Agent</button>
                        <Link style={controls_style} to={'/admins'} className="nav-link white-text link">
                            <button className="laserbtn laser-white_border-blue-bg">Admins</button>
                        </Link>
                        <Link style={controls_style} to={'/departments'} className="nav-link white-text link">
                            <button className="laserbtn laser-white_border-blue-bg">Departments</button>
                        </Link>
                        <button onClick={e => this.props.logout(e)} className="form-control laser-inline laser-100-width laser-grey-bg laserbtn pull-right">logout</button>
                    </div>
                </div>
                <div className="row">
                    <div className="container">
                        {
                            this.state.agents.map(agent => {
                                return <Agent agent={agent} key={agent._id} deleteClicked={this.showDeleteAgent} editClicked={this.showEditAgent}/>
                            })
                        }
                    </div>
                </div>
                <Loader isLoading={this.state.isLoading}/>
                {
                    this.state.showAddAgent ? <AddAgent closeModal={this.closeModal} departments={this.state.departments} closeModalGetAgents={this.closeModalGetAgents} /> : ""
                }
                {
                    this.state.showDeleteAgent ? <ConfirmAction  yesClicked={this.deleteAgent} noClicked={this.closeModal} message={this.state.confirmMessage} /> : ""
                }
            </div>   
        );
    }

}