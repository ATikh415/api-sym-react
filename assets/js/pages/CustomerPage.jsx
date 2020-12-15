import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Field from '../components/form/Field';
import { Create, Find, Update } from '../services/customersApi';

const Customer = ({ match, history}) => {

    const {id = "new"} = match.params

    const [customer, setCustomer] = useState({
        lastname: "",
        firstname: "",
        email: "",
        company: ""
    })
  
    const [error, setError] = useState({
        lastname: "",
        firstname: "",
        email: "",
        company: ""
    })

    const [editing, setEditing] = useState(false)

    //recuperation du customer en function de l'id
    const fetchCustomer = async (id) => {
         try{
            const { firstname, lastname, email, company } = await Find(id)
            setCustomer( { firstname, lastname, email, company } )
         } catch (error) {
             history.replace("/customers")
         }
    }

    //Chargement du customer si besoin au chargement du composant ou au vhargemetn de l'identifiant
    useEffect(() => {
        if(id !== "new"){
            setEditing(true)
            fetchCustomer(id)
        } 
    }, [id])

    // Gestion des changements des input dans le formulaire
    const handleChange = ({currentTarget}) => {
       const {name, value} = currentTarget
       setCustomer({ ...customer, [name]: value})
    }

    //Gestion de la soumision du formulaire 
    const handleSubmit = async (event) => {
        event.preventDefault()
        
        setError({})

        try {
            if(editing){
                await Update(id, customer)
                toast.success("Le client a ete bien modifier")
            }else {
                await Create(customer)
                toast.success("Le client a ete bien Créer")
                history.replace("/customers")
            }

        } catch ({ response }){
            const apiErrors = {};
            const { violations } = response.data

            if(violations){
                violations.map(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message
                })
            }
            toast.error("Errurs sur le formulaire")
            
            setError(apiErrors)
        }
    }

    return ( 
        <>
            {!editing ? <h1>Création d'un Client</h1> : <h1>Modification d'un Client</h1> }

            <form onSubmit={handleSubmit}>

                <Field 
                    name="lastname"
                    value={customer.lastname}
                    label="Nom de famille"
                    placeholder="Nom de famille du client"
                    onChange={handleChange}
                    error={error.lastname}
                />
                <Field 
                    name="firstname"
                    value={customer.firstname}
                    label="Prénom"
                    placeholder="Prénon du client"
                    onChange={handleChange}
                    error={error.firstname}
                
                /><Field 
                    name="email"
                    label="adresse email"
                    value={customer.email}
                    placeholder="Adresse Email du client"
                    type="email"
                    onChange={handleChange}
                    error={error.email}

                />
                <Field 
                    name="company"
                    value={customer.company}
                    label="Entreprise"
                    placeholder="Entreprise du client"
                    onChange={handleChange}
                    error={error.company}
                />
                <div className="form-groupe">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/customers" className="btn btn-link" >Retour a la liste</Link>
                </div>
            </form>
        </>
     );
}
 
export default Customer;