import React, {Component} from "react";

import Admin from "./Admin"
import { Link } from 'react-router-dom'
import AddAdmin from "./AddAdmin"
import EditAdmin from "./EditAdmin"
import ConfirmAction from '../ConfirmAction';
import Loader from '../../components/Loader';

import * as API from '../../api/Api';

const controls_style = {
    marginLeft:"8px",
    marginRight: "8px"
}

export default class Admins extends Component {
    constructor(props){
        super(props)

        this.state = {
            admins: [],
            selected_admin: {},
            showConfirm: false,
            showAddAdmin: false,
            showDeleteAdmin: false,
            showEditAdmin: false,
            confirmMessage: "",
            isLoading: false
        }

        this.getAdmins = this.getAdmins.bind(this);
        this.deleteAdmin = this.deleteAdmin.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.closeModalGetAdmins = this.closeModalGetAdmins.bind(this);
        this.showDeleteAdmin = this.showDeleteAdmin.bind(this);
        this.showAddAdmin = this.showAddAdmin.bind(this);
        this.showEditAdmin = this.showEditAdmin.bind(this);
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

    async getAdmins(){
        this.showLoading();

        const response = await(API.getAdmins());

        this.hideLoading();

        if(response==="error"){
            //show error message
            return;
        }

        if(response && response.data && response.data.length > 0){
            this.setState({
                admins: response.data
            })
        }
    }

    async deleteAdmin(admin){
        this.showLoading();

        const response = await(API.deleteAdmin(this.state.selected_admin._id));

        this.hideLoading();

        if(response==="error"){
            //show error message
            return;
        }

        if(response && response.data){
            this.closeModal();
            this.setState(state => {
                var admins = state.admins;

                admins.splice(admins.indexOf(state.selected_admin),1);

                return {
                    admins: admins,
                    selected_admin: {}
                }
            })
        }
    }

    closeModal(){
        this.setState({
            showConfirm: false,
            showAddAdmin: false,
            showDeleteAdmin: false,
            showEditAdmin: false
        })
    }

    closeModalGetAdmins(){
        this.setState({
            showConfirm: false,
            showAddAdmin: false,
            showDeleteAdmin: false,
            showEditAdmin: false
        });
        
        this.getAdmins();
    }

    showDeleteAdmin(e,admin){
        e.preventDefault();
        this.setState({
            selected_admin: admin,
            showDeleteAdmin: true,
            confirmMessage: "Are you sure you want to delete admin " +admin.firstname +"'s profile? This cant be undone."
        })
    }

    showAddAdmin(){
        this.setState({
            showAddAdmin:  true
        })
    }

    showEditAdmin(e,admin){
        e.preventDefault();
        this.setState({
            showEditAdmin:  true,
            selected_admin: admin
        })
    }

    componentDidMount(){
        this.getAdmins();
    }

    render(){
        return (
            <div className="laser-parent-div">
                <div className="laser-top-panel">
                    <h4 className="laser-inline">Laser Emergency Admins</h4>
                    <div className="laser-controls">
                        <Link style={controls_style} to={'/'} className="nav-link white-text link laser-inline laser-150-width">
                            <button className="laserbtn laser-white_border-blue-bg">View Map</button>
                        </Link>

                        <button onClick={this.showAddAdmin} style={controls_style} className="laser-inline laser-150-width laserbtn laser-white_border-blue-bg">Add Admin</button>
                        <Link style={controls_style} to={'/agents'} className="nav-link white-text link">
                            <button className="laserbtn laser-white_border-blue-bg">Agents</button>
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
                            this.state.admins.map(admin => {
                                return <Admin admin={admin} key={admin._id} deleteClicked={this.showDeleteAdmin} editClicked={this.showEditAdmin} />
                            })
                        }
                    </div>
                </div>
                <Loader isLoading={this.state.isLoading}/>
                
                {
                    this.state.showAddAdmin ? <AddAdmin closeModal={this.closeModal} departments={this.state.departments} closeModalGetAdmins={this.closeModalGetAdmins} /> : ""
                }

                {
                    this.state.showDeleteAdmin ? <ConfirmAction  yesClicked={this.deleteAdmin} noClicked={this.closeModal} message={this.state.confirmMessage} /> : ""
                }
            </div>   
        );
    }

}