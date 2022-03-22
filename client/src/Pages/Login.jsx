/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {  useState , useRef } from "react"
import axios from 'axios'

import Swal from 'sweetalert2'

import { COUNTRIES } from '../Utils/data'

import '../scss/pages/login.scss'

export default function Login({connect}){

    const [showLogin,switchState] = useState(true)

    let _loginForm = {
        email: useRef(),
        password: useRef()
    }
    let _signinForm = {
        email: useRef(),
        password: useRef(),
        confirm: useRef(),
        nom: useRef(),
        prenoms: useRef(),
        date_naissance: useRef(),
        nationalite: useRef(),
        specialite: useRef(),
    }

    let login = ()=>{
        if(checkAllValidity(_loginForm)){
            return 
        }
        axios.post('/api/login',{
            email: _loginForm.email.current.value,
            password: _loginForm.password.current.value
        }).then((r)=>{
            if(r.data.user){
                connect(r.data.user)
            }else{
                Swal.fire('Une erreur est survenue',r.data.error,'error');
            }
        }).catch(function(e){
            console.log(e)
        })
    }
    let signin = ()=>{
        if(checkAllValidity(_signinForm)){
            return 
        }
        if(_signinForm.password.current.value !== _signinForm.confirm.current.value){
            Swal.fire('Une erreur est survenue',"Mots de passe différents",'error');
            return
        }
        axios.post('/api/signin',{
            email: _signinForm.email.current.value,
            password: _signinForm.password.current.value,
            date_naissance: _signinForm.date_naissance.current.value,
            nom: _signinForm.nom.current.value,
            prenoms: _signinForm.prenoms.current.value,
            nationalite: _signinForm.nationalite.current.value,
            specialite: _signinForm.specialite.current.value,
        }).then((r)=>{
            if(r.data.success){
                Swal.fire('Opération effectuée',r.data.success,'success');
                for(let field in _signinForm){
                    _signinForm[field].current.value = ""
                    switchState(!showLogin)
                }
            }else{
                Swal.fire('Une erreur est survenue',r.data.error,'error');
            }
        }).catch(function(e){
            console.log(e)
        })
    }

    let checkAllValidity = (fields)=>{
        let unvalid = false
        for (const field in fields) {
            if(!fields[field].current.value){
                fields[field].current.style.borderBottom = "2px solid #fa414a"
                unvalid = true
            }
        }
        return unvalid
    }
    let checkValidity = (e)=>{
        e.target.style.borderBottom = "2px solid " + ( !e.target.value ? "#fa414a" : "#fff")
    }

    return <section className="login">
        <div className="main-container">
            <div className={"login-container " +(!showLogin ? "active" : "")}>
                <h3 className="container-title">Se connecter à DevPM</h3>
                <form className="login-container__form" autoComplete="off" onSubmit={(e)=>{e.preventDefault()}}>
                    <input 
                        ref={_loginForm.email}
                        className="form-input" 
                        name="login_email" 
                        type="email" 
                        placeholder="Email" 
                        required
                    /><br/>
                    <input 
                        ref={_loginForm.password}
                        className="form-input" 
                        name="login_pass" 
                        type="password" 
                        placeholder="Mot de passe" 
                        required
                    /><br/>
                    <button type="submit" onClick={login}>Se connecter</button>
                    <div className="switch">
                        Vous êtes nouveau ?
                        <button type="button" className="switch-state signin-trigger" onClick={()=>{switchState((!showLogin))}}>Inscrivez-vous</button>
                    </div>
                </form>
                
            </div>
            <div className={"signin-container "+(!showLogin ? "active" : "")}>
                <h3 className="container__title">S'inscrire à DevPM</h3>
                <form className="signin-container__form" autoComplete="off" onSubmit={(e)=>{e.preventDefault()}}>
                    <input 
                        ref={_signinForm.nom}
                        className="form-input half-field" 
                        name="signin_nom" 
                        type="text" 
                        placeholder="Nom" 
                        required
                        onChange={(e)=>{checkValidity(e)}}
                    />
                    <input 
                        ref={_signinForm.prenoms}
                        className="form-input half-field" 
                        name="signin_prenoms" 
                        type="text" 
                        placeholder="Prénoms" 
                        required
                        onChange={(e)=>{checkValidity(e)}}
                    />
                    <input 
                        ref={_signinForm.email}
                        className="form-input" 
                        type="email" 
                        name="signin_email" 
                        placeholder="Email" 
                        required
                        onChange={(e)=>{checkValidity(e)}}
                    />
                    <input 
                        ref={_signinForm.date_naissance}
                        className="form-input half-field" 
                        name="signin_naissance" 
                        type="date" 
                        placeholder="Date de naissance" 
                        required
                        onChange={(e)=>{checkValidity(e)}}
                    />
                    <select 
                        ref={_signinForm.nationalite}
                        className="form-select half-field" 
                        name="info_nationalite" 
                        defaultValue={""}
                        onChange={(e)=>{checkValidity(e)}}
                    >
                        <option value="">Nationalité</option>
                        {COUNTRIES.map((c,k)=> <option key={k} value={c}>{c}</option>)}
                    </select>
                    <select 
                        ref={_signinForm.specialite}
                        className="form-select" 
                        name="signin_specialite" 
                        required 
                        defaultValue={""}
                        onChange={(e)=>{checkValidity(e)}}
                    >
                        <option value="">Spécialité</option>
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Fullstack">Fullstack</option>
                    </select>
                    <input 
                        ref={_signinForm.password}
                        className="form-input half-field" 
                        name="signin_pass" 
                        type="password" 
                        placeholder="Mot de passe" 
                        required
                        onChange={(e)=>{checkValidity(e)}}
                    />
                    <input 
                        ref={_signinForm.confirm}
                        className="form-input half-field" 
                        name="signin_confirm_pass" 
                        type="password" 
                        placeholder="Confirmer le mot de passe" 
                        required
                        onChange={(e)=>{checkValidity(e)}}
                    />
                    <button type="submit" onClick={signin}>S'inscrire</button>
                    <div className="switch">
                        Vous avez déjà un compte ?
                        <button type="button" className="switch-state login-trigger" onClick={()=>{switchState((!showLogin))}}>Connectez-vous</button>
                    </div>
                </form>
            </div>
            <div className={"image-block "+(!showLogin ? "active" : "")}></div>
        </div>
    </section>
}


        

