import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/form/Field';
import Create from '../services/UserApi';


const Register = ({history}) => {

    const [user, setUser] = useState(
        {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            passwordConfirm: ""
        }
    )

    const [errors, setErrors] = useState(
        {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            passwordConfirm: ""
        }
    )

    const handleChange = ({ currentTarget }) => {
       const {name, value} = currentTarget
       setUser({ ...user, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        await Create()
        const apiErrors = {}

        if(user.password !== user.passwordConfirm){
            apiErrors.passwordConfirm = 
                "Votre confirmation de mot de passe n'est pas conforme"
            setErrors(apiErrors)
            return
        }

        try {
            
            setErrors({})
            history.replace("/login")
        } catch (e) {
            const {violations} = e.response.data

            if(violations){

                violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message
                })
                setErrors(apiErrors)
            }
        }
    }

    return ( <>
        <h1>Inscription</h1>
        <form onSubmit={handleSubmit}>

            <Field
                name="firstName"
                label="Prénom"
                placeholder="Votre prénom"
                value={user.firstName}
                onChange={handleChange}
                error={errors.firstName}
            />
            <Field
                name="lastName"
                label="Nom :"
                placeholder="Votre nom de famille ?"
                value={user.lastName}
                onChange={handleChange}
                error={errors.lastName}
            />
            <Field
                name="email"
                type="email"
                label="Adresse email"
                placeholder="Votre Adresse email"
                value={user.email}
                onChange={handleChange}
                error={errors.email}
            />
            <Field
                name="password"
                type="password"
                label="Mot de passe"
                placeholder="Votre mot de passe"
                value={user.password}
                onChange={handleChange}
                error={errors.password}
            />
            <Field
                name="passwordConfirm"
                type="password"
                label="Confirmation de mot de passe"
                placeholder="Confirmer votre mot de passe?"
                value={user.passwordConfirm}
                onChange={handleChange}
                error={errors.passwordConfirm}
            />

            <div className="form-group">
                <button type="submit" className="btn btn-primary">Inscription</button>
                <Link to="/login" className="btn btn-link">J'ai deja un compte</Link>
            </div>
            
        </form>
    </> );
}
 
export default Register;