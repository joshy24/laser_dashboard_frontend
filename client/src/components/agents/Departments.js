import React, {Component} from "react";

import { Link } from 'react-router-dom'

import Loader from '../../components/Loader';
import Department from './Department'
import ConfirmAction from '../ConfirmAction';
import AddDepartment from './AddDepartment'

import * as API from '../../api/Api';

const controls_style = {
    marginLeft:"8px",
    marginRight: "8px"
}

export default class Departments extends Component{
    constructor(props){
        super(props)

        this.state = {
            departments: [],
            selected_department: {},
            showConfirm: false,
            showAddDepartment: false,
            showDeleteDepartment: false,
            showEditDepartment: false,
            confirmMessage: "",
            isLoading: false
        }

        this.getDepartments = this.getDepartments.bind(this);
        this.deleteDepartment = this.deleteDepartment.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.showDeleteDepartment = this.showDeleteDepartment.bind(this);
        this.showAddDepartment = this.showAddDepartment.bind(this);
        this.showEditDepartment = this.showEditDepartment.bind(this);
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

    async getDepartments(){
        this.showLoading();

        const response = await(API.getDepartments());

        this.hideLoading();

        if(response==="error"){
            //show error message
            return;
        }

        if(response && response.data && response.data.length > 0){
            this.setState({
                departments: response.data
            })
        }
    }

    async deleteDepartment(){
        this.showLoading();
        
        const response = await(API.deleteDepartment(this.state.selected_department._id));

        this.hideLoading();

        if(response==="error"){
            //show error message
            return;
        }

        if(response && response.data){
            this.closeModal();
            this.setState(state => {
                var departments = state.departments;

                departments.splice(departments.indexOf(state.selected_department),1);

                return {
                    departments: departments,
                    selected_department: {}
                }
            })
        }
    }

    showDeleteDepartment(e, department){
        this.setState({
            selected_department: department,
            showDeleteDepartment: true,
            confirmMessage: "Are you sure you want to delete the selected department?"
        })
        e.preventDefault();
    }

    showAddDepartment(){
        this.setState({
            showAddDepartment:  true
        })
    }

    showEditDepartment(e, department){
        this.setState({
            showEditDepartment:  true,
            selected_department: department
        })
        e.preventDefault();
    }

    closeModal(){
        this.setState({
            showConfirm: false,
            showAddDepartment: false,
            showDeleteDepartment: false,
            showEditDepartment: false
        })
    }

    componentDidMount(){
        this.getDepartments();
    }

    render(){
        return (
            <div className="laser-parent-div">
                <div className="laser-top-panel">
                    <h4 className="laser-inline">Laser Emergency Admin - Departments</h4>
                    <div className="laser-controls">
                        <Link style={controls_style} to={'/'} className="nav-link white-text link laser-inline laser-150-width">
                            <button className="laserbtn laser-white_border-blue-bg">View Map</button>
                        </Link>

                        <Link style={controls_style} to={'/agents'} className="nav-link white-text link">
                            <button className="laserbtn laser-white_border-blue-bg">Agents</button>
                        </Link>
                        <Link style={controls_style} to={'/admins'} className="nav-link white-text link">
                            <button className="laserbtn laser-white_border-blue-bg">Admins</button>
                        </Link>
                        <Link style={controls_style} to={'/departments'} className="nav-link white-text link">
                            <button className="laserbtn laser-white_border-blue-bg">Departments</button>
                        </Link>
                        <button style={controls_style} onClick={this.showAddDepartment} className="laser-inline laser-150-width laserbtn laser-white_border-blue-bg">Add Department</button>
                        <button onClick={e => this.props.logout(e)} className="form-control laser-inline laser-100-width laser-grey-bg laserbtn pull-right">logout</button>
                    </div>
                </div>
                <div className="row">
                    <div className="container">
                        <br/>
                        {
                            this.state.departments.map(department => {
                                return <Department key={department._id} department={department} deleteClicked={this.showDeleteDepartment} editClicked={this.showEditDepartment} />
                            })
                        }
                    </div>
                </div>
                {
                    this.state.showAddDepartment ? <AddDepartment getDepartments={this.getDepartments} closeModal={this.closeModal}/> : ""
                }
                {
                    this.state.showDeleteDepartment ? <ConfirmAction  yesClicked={this.deleteDepartment} noClicked={this.closeModal} message={this.state.confirmMessage} /> : ""
                }
                <Loader isLoading={this.state.isLoading}/>
            </div>
        );
    }

}