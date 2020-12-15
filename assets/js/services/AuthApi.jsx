import React from 'react';
import axios from "axios";
import jwtDecode from 'jwt-decode';
import { LOGIN_API } from './config';



export function Logout(){
    window.localStorage.removeItem('authToken')
    delete axios.defaults.headers['Authorization']
}

export function Authenticate(credentials){
    return axios
        .post(LOGIN_API, credentials)
        .then(response => response.data.token)
        .then(token => {
            // Stocker le token dans localStorage
             window.localStorage.setItem('authToken', token)
    
            //On previent axios qu'on maintenant un header par defaut sur toutes les requete future
             getAxiosToken(token)

        })

}
function getAxiosToken(token){
    axios.defaults.headers["Authorization"] = "Bearer " + token
}

export function Setup(){
    const token = window.localStorage.getItem('authToken')

    if(token){
        const {exp} = jwtDecode(token)
  
        if(exp * 1000 > new Date().getTime()){
            
            getAxiosToken(token)
        } else {
            Logout()
        }
    }
}

export function IsAuthenticated(){
    const token = window.localStorage.getItem('authToken')

    if(token){
        const {exp} = jwtDecode(token)
        
        if(exp * 1000 > new Date().getDate()){
            return true
        }
        return false
    }
     return false
}