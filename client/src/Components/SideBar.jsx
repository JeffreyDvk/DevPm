import {Link} from 'react-router-dom'

export default function SideBar({user,activePage,isMenuHide,_logout}){

    function addActiveClass(p){
        return activePage===p ? "active" : '' 
    }

    return <nav className={"nav-bar "+isMenuHide('hide')} >
        {user.status ?
        <Link className={"nav-bar__button "+addActiveClass(1)} to="/Devs">
            <i className="bi bi-people"></i>
            Devs
        </Link>
        : ''}
        <Link className={"nav-bar__button "+addActiveClass(2)} to="/Taches">
            <i className="bi bi-tools"></i>
            Tâches
        </Link>
        <Link className={"nav-bar__button "+addActiveClass(3)} to="/Profile">
            <i className="bi bi-person-badge"></i>
            Profile
        </Link>
        <button className="nav-bar__button" onClick={_logout}>
            <i className="bi bi-box-arrow-right"></i>
            Déconnexion
        </button>
    </nav>
}