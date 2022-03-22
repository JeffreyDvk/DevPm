/* esbutttonnt-disable jsx-a11y/anchor-is-vabutttond */
import React from "react"
import Swal from 'sweetalert2'
import axios from 'axios'

import Datatable from '../Components/Datatable/Datatable'
import Modal from '../Components/Modal/Modal'
import Dashboard from './Dashboard'

import "../scss/pages/tasks.scss"

class Tasks extends React.Component{
    
    constructor(props){
        super(props)
        this.state = {
            activeDrop: -1,
            data: [],
            addTaskModal: {
                isShow: false,
                hasClass: false
            },
            deleteTaskModal: {
                isShow: false,
                hasClass: false
            },
            updateTaskModal: {
                isShow: false,
                hasClass: false
            }
        }
        this.addTaskModalFields = {
            description: React.createRef(),
            date_debut: React.createRef(),
            duree: React.createRef(),
            heure_consomme: React.createRef(),
        }
        this.updateTaskModalFields = {
            key: React.createRef(),
            description: React.createRef(),
            heure_consomme: React.createRef(),
            fini: React.createRef()
        }
        this.deleteField = React.createRef()
    }
    updateState = (field,value)=>{
        let _state = this.state
        _state[field] = value
        this.setState(_state)
    }
    componentDidMount(){
        axios.post('/api/getTasks',{user: this.props.user.email}).then((r)=>{
            if(!r.data.error){
                this.updateState("data",this.format(this.formatState(r.data.tasks)))
            }
        }).catch(function(e){

        }) 
    }

    switchModal = (key)=>{
        let modal = this.state[key]
        if(!modal.isShow){
            this.updateState(key,{
                isShow: !modal.isShow,
                hasClass: modal.hasClass
            })
            modal = this.state[key]
            setTimeout(()=>{
                this.updateState(key,{
                    isShow: modal.isShow,
                    hasClass: !modal.hasClass
                })
            },100)
        }else{
            
            this.updateState(key,{
                isShow: modal.isShow,
                hasClass: !modal.hasClass
            })
            modal = this.state[key]
            setTimeout(()=>{
                this.updateState(key,{
                    isShow: !modal.isShow,
                    hasClass: modal.hasClass
                })
            },500)
            this.updateState("activeDrop",-1)
            this.updateState("data",this.format(this.state.data))
        }
    }
    showDropdown = (key)=>{
        this.state.activeDrop === key  ? this.updateState("activeDrop",-1) : this.updateState("activeDrop",key)
        this.updateState("data",this.format(this.state.data))
    }
    showUpdateModal = (key)=>{
        this.updateState("data",this.format(this.state.data))
        this.switchModal("updateTaskModal")
        setTimeout(()=>{
            this.updateTaskModalFields.key.current.value = key
            this.updateTaskModalFields.description.current.value = this.state.data[key][1]
            this.updateTaskModalFields.heure_consomme.current.value = this.state.data[key][3]
        },100)
    }
    showDeleteTask = (key)=>{
        this.switchModal("deleteTaskModal")
        this.updateState("activeDrop",-1)
        setTimeout(()=>{
            this.deleteField.current.value = this.state.data[key][0]
        },100)
    }

    isActive = (key)=>{
        if(this.state){
            return this.state.activeDrop === key ? "active" : ""
        }return ''
    }
    addActions = (status,key)=>{
        if(status!=="Actif"){
            return <div className="row-action">
                <button className="row-action__trigger action-disable">---</button>
            </div>
        }else{
            return <div className="row-action" onClick={()=>{this.showDropdown(key)}}>
                <button className="row-action__trigger" >Actions</button>
                <ul className={"row-actions "+this.isActive(key)}>
                    <li className="row-actions__element row-update" onClick={(e)=>{this.showUpdateModal(key) }}><button>Modifier</button></li>
                    <li className="row-actions__element row-delete" onClick={(e)=>{this.showDeleteTask(key) }}><button>Supprimé</button></li>
                </ul>
            </div>
        }
    }
    formatState = (_data)=>{
        let data = _data.map((row,key)=>{
            row[4] = row[4] ? 
                        <p className="row-status__active">Actif</p> : 
                        <p className="row-status__inactive">Inactif</p> 
            return row
        })
        return data
    }
    format = (_data)=>{
        let data = _data.map((row,key)=>{
            if(row.length < 6){
                row.push(this.addActions(row[4].props ? row[4].props.children : row[4],key))
            }else{
                row[5] = this.addActions(row[4].props ? row[4].props.children : row[4],key)
            }
            return row
        })
        return data
    }

    addTask = ()=>{
        let fields = this.addTaskModalFields
        if(!this.checkAllValidity(fields)){
            axios.post('/api/addTask',{
                description: fields.description.current.value,
                date_debut: fields.date_debut.current.value,
                duree: fields.duree.current.value,
                heure_consomme: fields.heure_consomme.current.value,
                author: this.props.user.email
            }).then((r)=>{
                if(r.data.success){
                    this.switchModal('addTaskModal')
                    Swal.fire('Opération effectuée',r.data.success,'success');
                    axios.post('/api/getTasks',{user: this.props.user.email}).then((r)=>{
                        if(!r.data.error){
                            this.updateState("data",this.format(this.formatState(r.data.tasks)))
                        }
                    }).catch(function(e){

                    }) 
                }
            }).catch(function(e){

            })
        }
    }
    deleteTask = ()=>{
        axios.post('/api/deleteTask',{
            key: this.deleteField.current.value,
        }).then((r)=>{
            if(r.data.success){
                this.switchModal('deleteTaskModal')
                Swal.fire('Opération effectuée',r.data.success,'success');
                axios.post('/api/getTasks',{user: this.props.user.email}).then((r)=>{
                    if(!r.data.error){
                        this.updateState("data",this.format(this.formatState(r.data.tasks)))
                    }
                }).catch(function(e){
                    
                }) 
            }else{
                Swal.fire('Un problème est survenu',r.data.error,'error');
            }
        }).catch(function(e){
            
        })
    }
    updateTask = ()=>{
        let fields = this.updateTaskModalFields
        if(!this.checkAllValidity(fields)){
            axios.post('/api/updateTask',{
                key: this.state.data[fields.key.current.value][0],
                description: fields.description.current.value,
                heure_consomme: fields.heure_consomme.current.value,
                fini: !fields.fini.current.checked
            }).then((r)=>{
                if(r.data.success){
                    this.switchModal('updateTaskModal')
                    Swal.fire('Opération effectuée',r.data.success,'success');
                    axios.post('/api/getTasks',{user: this.props.user.email}).then((r)=>{
                        if(!r.data.error){
                            this.updateState("data",this.format(this.formatState(r.data.tasks)))
                            if(fields.fini.current.checked){
                                axios.post('/api/updateUser',{user: this.props.user.email,total_heure: parseInt(fields.heure_consomme.current.value) + parseInt(this.props.user.total_heure)}).then((r)=>{
                                     this.props.updateUser()
                                }).catch(function(e){
                                    
                                })
                            }
                        }
                    }).catch(function(e){
                        
                    })
                }else{
                    Swal.fire('Un problème est survenu',r.data.error,'error');
                }
            }).catch(function(e){

            })
        }
    }
    checkValidity = (e)=>{
        e.target.style.border = "2px solid " + ( !e.target.value ? "#fa414a" : "#cccccc")
    }
    checkAllValidity = (fields)=>{
        let unvalid = false
        for (const field in fields) {
            if(!fields[field].current.value){
                fields[field].current.style.border = "2px solid #fa414a"
                unvalid = true
            }
        }
        return unvalid
    }

    render(){

        return <Dashboard user={this.props.user} page={2} logout={this.props.logout}>
            <div className="tasks">
                <div className="create-task">
                    <button onClick={()=>{this.switchModal('addTaskModal')}} className="bttn-fill bttn-md bttn-primary" >
                        Nouvelle tâche
                        <i className="bi bi-pencil-square"></i>
                    </button>
                </div>
                <Datatable 
                    columns={["Id","Description","Total d'heure","Heure(s) Consommée(s)","Status","Action"]}
                    rows={this.state.data}
                    ignore={[4,5]}
                    rowLimit={10}
                />
                {this.state.addTaskModal.isShow ? <Modal
                    show={this.state.addTaskModal.hasClass}
                    header={ <h5 className="modal__header__title" id="exampleModalLabel">Créér une nouvelle tâche</h5> }
                    content={
                        <form className="create-task-form" onSubmit={(e)=>{e.preventDefault()}}>
                            <div className="with-label">
                                <label htmlFor="add_task_description">Description</label>
                                <input 
                                    ref={this.addTaskModalFields.description} 
                                    type="text" 
                                    className=""
                                    id="add_task_description" 
                                    name="add_task_description" 
                                    placeholder=""
                                    onChange={(e)=>{this.checkValidity(e)}}
                                    required
                                /><br/>
                            </div>
                            <div className="with-label">
                                <label htmlFor="add_task_start_date">Date de début</label>
                                <input 
                                    ref={this.addTaskModalFields.date_debut} 
                                    type="datetime-local" 
                                    className="date-trigger" 
                                    id="add_task_start_date" 
                                    name="task_start_date" 
                                    min={0}
                                    placeholder="" 
                                    onChange={(e)=>{this.checkValidity(e)}}
                                    required/><br/>
                            </div>
                            <div className="with-label">
                                <label htmlFor="add_task_total_heure">Durée ( Total d'heure )</label>
                                <input 
                                    ref={this.addTaskModalFields.duree} 
                                    type="number" 
                                    name="task_total_heure" 
                                    id="add_task_total_heure" 
                                    min={0}
                                    placeholder=""
                                    onChange={(e)=>{this.checkValidity(e)}}
                                    required
                                /><br/>
                            </div>
                            <div className="with-label">
                                <label htmlFor="add_task_heure_consomme">Heure(s) déjà consommée(s)</label>
                                <input 
                                    ref={this.addTaskModalFields.heure_consomme} 
                                    type="number" 
                                    name="task_heure_consomme" 
                                    id="add_task_heure_consomme" 
                                    placeholder="" 
                                    onChange={(e)=>{this.checkValidity(e)}}
                                    required/><br/>
                            </div>
                            <div className="modal__actions">
                                <button onClick={()=>{this.switchModal('addTaskModal')}} type="button" className="bttn-simple bttn-md bttn-primary" data-bs-dismiss="modal">Annuler</button>
                                <button type="submit" className="bttn-simple bttn-md bttn-success" onClick={this.addTask}>Créer</button>
                            </div>
                        </form>
                    }
                    unmountModal={()=>{this.switchModal('addTaskModal')}}
                /> : ''}
                {this.state.updateTaskModal.isShow ? <Modal
                    show={this.state.updateTaskModal.hasClass}
                    header={
                        <h5 className="modal__header__title" id="exampleModalLabel">Modifier la tâche</h5>
                    }
                    content={
                        <form className="update-task-form" onSubmit={(e)=>{e.preventDefault()}}>
                            <input ref={this.updateTaskModalFields.key} type="hidden" id="task_id"/>
                            <div className="with-label">
                                <label htmlFor="update_task_description">Description</label>
                                <input ref={this.updateTaskModalFields.description} type="text" className="" id="update_task_description" name="update_task_description" placeholder="" required/><br/>
                            </div>
                            <div className="with-label">
                                <label htmlFor="update_task_heure_consomme" >Heure(s) déjà consommée(s)</label>
                                <input ref={this.updateTaskModalFields.heure_consomme} min={0} type="number" name="task_heure_consomme" id="update_task_heure_consomme" placeholder="" required/><br/>
                            </div>
                            <label htmlFor="end">
                                <input ref={this.updateTaskModalFields.fini} type="checkbox" id="end" name="end"/> Marqué la tâche comme finie ?
                            </label>
                            <div className="modal__actions">
                                <button onClick={()=>{this.switchModal('updateTaskModal')}} type="button" className="bttn-simple bttn-md bttn-primary" data-bs-dismiss="modal">Annuler</button>
                                <button type="submit" className="bttn-simple bttn-md bttn-success" onClick={this.updateTask}>Modifier</button>
                            </div>
                        </form>
                    }
                    unmountModal={()=>{this.switchModal('updateTaskModal')}}
                /> : ''}
                {this.state.deleteTaskModal.isShow ? <Modal
                    show={this.state.deleteTaskModal.hasClass}
                    closeButton={false}
                    content={<>
                        <div className="content-center popup-icon popup__warning">
                            <div>
                                <i className="bi bi-exclamation-octagon "></i>
                            </div>
                            <h5 className="modal__header__title content-center" id="exampleModalLabel">Voulez-vous réellement supprimé la tâche ?</h5>
                        </div>
                        <form onSubmit={(e)=>{e.preventDefault()}}>
                            <input ref={this.deleteField} type="hidden" name="id"/>
                        </form>
                        <div className="modal__actions content-center">
                            <button onClick={()=>{this.switchModal('deleteTaskModal')}} type="button" className="bttn-simple bttn-md bttn-primary" data-bs-dismiss="modal">Annuler</button>
                            <button type="button" className="bttn-simple bttn-md bttn-danger" onClick={this.deleteTask}>Supprimer</button>
                        </div>
                    </>
                    }
                    unmountModal={()=>{this.switchModal('deleteTaskModal')}}
                /> : ''}
            </div>
        </Dashboard>
    }
}

export default Tasks