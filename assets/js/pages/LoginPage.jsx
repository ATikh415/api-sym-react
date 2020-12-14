import React, { useState } from 'react';
import Field from '../components/form/Field';
import { Authenticate } from '../services/AuthApi';

const Login = ({ onLogin, history }) => {

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    })

    const [error, setError] = useState("")

    const handleChange = ({ currentTarget }) => {
        const {value, name} = currentTarget
        setCredentials({...credentials, [name]: value})
    }

    const handleSubmit = async event => {
        event.preventDefault()
        try{
            await Authenticate(credentials)
            setError("")
            onLogin(true)
            history.replace("/customers")

        } catch (error) {
            setError("Email ou mot de passe invalide !")
        }

    }


    return ( 
        <>
            <h1>Connexion a l'appication</h1>

            <form className="col-md-9" onSubmit={handleSubmit}>
                <Field 
                    name = "username"
                    label = "Adresse email"
                    value = {credentials.username}
                    onChange = {handleChange}
                    placeholder = "Adresse email de connexion"
                    error = {error}
                />
                <Field 
                    name="password"
                    label="Mot de passe"
                    value={credentials.value}
                    onChange={handleChange}

                />
                
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Se connecter</button>
                </div>
            </form>
        </>
     );
}
 
export default Login;