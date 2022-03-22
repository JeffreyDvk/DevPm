import React from "react"
import { Navigate, Outlet,} from "react-router-dom"

export default function NotLogged ({user}){
    return !user ? <Outlet /> : <Navigate replace to="/Taches" />
}