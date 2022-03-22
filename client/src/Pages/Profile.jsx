/* esbutttonnt-disable jsx-a11y/anchor-is-vabutttond */
import React, { useRef } from "react"
import axios from 'axios'
import Swal from 'sweetalert2'

import Dashboard from './Dashboard'

import '../scss/pages/profile.scss'
import { COUNTRIES } from '../Utils/data'

export default function Profile({user,logout,updateUser}){

    let _userField = {
        nom: useRef(),
        prenoms: useRef(),
        date_naissance: useRef(),
        nationalite: useRef(),
        specialite: useRef(),
    }
    let _passwordField = {
        pass: useRef(),
        confirm: useRef()
    }

    let _updateUser = (type)=>{
        let data
        if(type===1){
            if(checkAllValidity(_userField)){
                return
            }
            data = {
                user: user.email,
                nom: _userField.nom.current.value,
                prenoms: _userField.prenoms.current.value,
                date_naissance: _userField.date_naissance.current.value,
                nationalite: _userField.nationalite.current.value,
                specialite: _userField.specialite.current.value,
            }
        }else{
            if(checkAllValidity(_passwordField)){
                return
            }
            data = {
                user: user.email,
                actual_password: user.password,
                password: _passwordField.pass.current.value,
                confirm: _passwordField.confirm.current.value,
            }
        }
        axios.post('/api/updateUser',data).then((r)=>{
            if(r.data.success){
                Swal.fire('Opération effectuée',r.data.success,'success');
            }else{
                Swal.fire('Une erreur est survenue',r.data.error,'error');
            }
            updateUser()
        }).catch(function(e){
            console.log(e)
        })
    }
    let checkAllValidity = (fields)=>{
        let unvalid = false
        for (const field in fields) {
            if(!fields[field].current.value){
                fields[field].current.style.border = "2px solid #fa414a"
                unvalid = true
            }
        }
        return unvalid
    }
    let checkValidity = (e)=>{
        e.target.style.border = "2px solid " + ( !e.target.value ? "#fa414a" : "#242424")
    }
    
    return <Dashboard user={user} page={3} logout={logout}>
        <div className="profile">
            <div className="user">
                <img src={require("../assets/img/profil/profile.jpg")} alt="user_profile"/>
                <div className="user__infos">
                    <h4 className="user__name">{user.nom+" "+user.prenoms}</h4>
                    <p className="user__email">{user.email}</p>
                    <p className="user__stack">{user.specialite}</p>
                </div>
            </div>
            <p className="hour-count">Totale globale d'heures accumulé: <span>{parseInt(user.total_heure)}</span></p>
            <form className="form-info" onSubmit={(e)=>{e.preventDefault()}}>
                <h4 className="form-title">Modification des informations</h4>
                <input 
                    ref={_userField.nom} 
                    className="form-input half-field" 
                    name="info_nom" 
                    type="text" 
                    placeholder="Nom" 
                    defaultValue={user.nom} 
                    onChange={(e)=>{checkValidity(e)}}
                    required
                />
                <input 
                    ref={_userField.prenoms} 
                    className="form-input half-field" 
                    name="info_prenoms" 
                    type="text" 
                    placeholder="Prénoms" 
                    defaultValue={user.prenoms} 
                    onChange={(e)=>{checkValidity(e)}}
                    required
                /><br/>
                <input 
                    ref={_userField.date_naissance} 
                    className="form-input " 
                    name="info_naissance" 
                    type="date" 
                    placeholder="Date de naissance" 
                    defaultValue={ (new Date(user.date_naissance)).toISOString().split('T')[0]} 
                    onChange={(e)=>{checkValidity(e)}}
                    required
                /><br/>
                <select 
                    ref={_userField.nationalite} 
                    className="form-select half-field" 
                    name="info_nationalite" 
                    defaultValue={user.nationalite}
                    onChange={(e)=>{checkValidity(e)}}
                >
                    <option value="">Nationalité</option>
                    {COUNTRIES.map((c,k)=> <option key={k} value={c}>{c}</option>)}
                </select>
                <select 
                    ref={_userField.specialite} 
                    className="form-select half-field" 
                    name="info_specialite" 
                    defaultValue={user.specialite}
                    onChange={(e)=>{checkValidity(e)}}
                    required
                >
                    <option value="" >Spécialité</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Fullstack">Fullstack</option>
                </select>
                <div>
                    <button type="button" onClick={()=>_updateUser(1)}>Modifier</button>
                </div>
            </form>
            <form className="form-pass" onSubmit={(e)=>{e.preventDefault()}}>
                <h4 className="form-title">Modification du mot de passe</h4>
                <input 
                    ref={_passwordField.pass}
                    className="form-input half-field" 
                    name="info_pass" 
                    type="password" 
                    placeholder="Ancien mot de passe" 
                    onChange={(e)=>{checkValidity(e)}}
                    required
                />
                <input 
                    ref={_passwordField.confirm} 
                    className="form-input half-field" 
                    name="info_new_pass" 
                    type="password" 
                    placeholder="Nouveau mot de passe" 
                    onChange={(e)=>{checkValidity(e)}}
                    required
                />
                <button type="button" onClick={()=>_updateUser(2)}>Modifier</button>
            </form>
        </div>
    </Dashboard>
}