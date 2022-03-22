import React from "react"
import {Link} from 'react-router-dom'

export default function TopBar ({user,hideMenu,isMenuHide}){

    return <section className="header-bar flex">
        <div className="header-bar__info">
            <button className={"menu-trigger "+isMenuHide('active')} onClick={hideMenu}>
                <i className="bi bi-caret-left-square-fill"></i>
            </button>
            <h4 className="logo">DevPM</h4>
        </div>
        <Link to="/Profile" className="user">
            <i className="bi bi-person-badge user__icon"></i>
            <span className="user__name">{user.nom+" "+user.prenoms}</span>
        </Link>
    </section>
}