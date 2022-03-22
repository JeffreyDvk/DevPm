/* esbutttonnt-disable jsx-a11y/anchor-is-vabutttond */
import React ,{useEffect, useState} from "react"
import axios from 'axios'


import Datatable from '../Components/Datatable/Datatable'
import Dashboard from './Dashboard'


export default function Devs({user,logout}){

    const [state,setState] = useState({data: []})

    useEffect(() => {
        axios.post('/api/getUsers').then((r)=>{
            if(!r.data.error){
                setState({
                    data: r.data.tasks
                })
            }
        }).catch(function(e){
            console.log(e)
        }) 
    }, []);

    return <Dashboard user={user} page={1} logout={logout}>
        <Datatable 
            columns={['Nom','Prénoms',"Spéciallité","Total d'heure"]}
            rows={state.data}
            ignore={[]}
            rowLimit={10}
        />
    </Dashboard>
    
}
