/* esbuttonnt-disable jsx-a11y/anchor-is-vabuttond */
import React, { useState}  from "react"
import Swal from 'sweetalert2'

import SideBar from "../Components/SideBar"
import TopBar from "../Components/TopBar"

import '../scss/pages/dashboard.scss'

export default function Dashboard({user,children,page,logout}){

    const [menuIsHide,switchMenuState] = useState(0)

    function _logout(){
        Swal.fire({
            title: 'Déconnexion',
            text: "Êtes-vous sûr de vouloir vous déconnecter ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non'
        }).then((result)=>{
            if (result.isConfirmed) {
                logout()
            }
        })
    }
    function isMenuHide(_class){
        return menuIsHide ? _class : ''
    }
    function hideMenu(){
        switchMenuState(!menuIsHide)
    }

    return <main>
        <TopBar user={user} hideMenu={hideMenu} isMenuHide={isMenuHide} /> 
        <section className="content">
            <SideBar user={user} activePage={page} isMenuHide={isMenuHide} _logout={_logout} />
            <div className="page">
                {children}
            </div>
        </section>
    </main>
}