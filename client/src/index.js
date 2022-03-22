import React, { useState , useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Route , Routes , BrowserRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'

import Profile from './Pages/Profile';
import Devs from './Pages/Devs'
import Tasks from './Pages/Tasks'
import Login from './Pages/Login'

import NotLogged from './Routes/NotLogged'
import Logged from './Routes/Logged'

import './scss/main.scss'

function App(){
    const [user,setUser] = useState(undefined)

    useEffect(() => {
        let usr = Cookies.get("DevPM_User")
        setUser(usr ? JSON.parse(usr) : usr)

    }, []);

    function logout(){
        Cookies.remove('DevPM_User')
        setUser(undefined)
    }
    let connect = (_user)=>{
        Cookies.set("DevPM_User",JSON.stringify(_user),{ expires: 2 })
        setUser(_user)
    } 
    function updateUser(){
        axios.post('/api/getUser',{user: user.email}).then((r)=>{
            Cookies.remove('DevPM_User')
            Cookies.set("DevPM_User",JSON.stringify(r.data.user),{ expires: 2 })
            setUser(r.data.user)
        }).catch(function(e){
            
        })
    }

    return <BrowserRouter>
        <Routes>
        <Route element={<NotLogged user={user}/>}>
            <Route path='/' element={<Login connect={connect} />} />
            <Route path='/Login' element={<Login connect={connect}/>} />
        </Route>
        <Route element={<Logged user={user}/>}>
            <Route path="/Devs" element={<Devs user={user} logout={logout}/>} />
            <Route path="/Taches" element={<Tasks user={user} updateUser={updateUser} logout={logout}/>} />
            <Route path="/Profile" element={<Profile user={user} updateUser={updateUser}  logout={logout}/>} />
        </Route>
        <Route
            path='*'
            element={
            "Bienvenue dans le nullpart. Ta quête de vérité t'as conduit à ce vide intersidéral. Bref !! 404 !! Rien à signaler"
            }
        />
        </Routes>
    </BrowserRouter>
}

ReactDOM.render(<React.StrictMode>
    <App />
</React.StrictMode> ,document.getElementById('root'))