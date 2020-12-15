import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/form/Field';
import Select from '../components/form/Select';
import {FindAll } from '../services/customersApi';
import { Find, Update, Create } from '../services/InvoicesApi';
import { toast } from 'react-toastify';

const Invoice = ({ history, match }) => {

    const {id = "new"} = match.params

    const [editing, setEditing] = useState(false)

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    })

    const [customers, setCustomers] = useState([])
    
    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    })

    const handleChange = ({ currentTarget }) => {
        const { value, name } = currentTarget

        setInvoice({...invoice, [name]: value})
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            setErrors({})           
             if(editing){
                 await Update(id, invoice)
                 toast.success("La facture a été bien modifiée")
                
            } else {
                await Create(invoice)
                toast.success("La facture a été bien créée")

                history.replace("/invoices")
            }

        }  catch ({ response }){
            
            const apiErrors = {};
            const { violations } = response.data

            if(violations){
                violations.map(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message
                })
            }
            
            setErrors(apiErrors)
            toast.error("Erreurs sur votre formulaire")

        }
    }


    const fetchCustomers = async () => {
        try {
            const data = await FindAll()
            setCustomers(data)

            if(!invoice.customer) setInvoice({ ...invoice, customer: data[0].id})

        } catch (e) {
            toast.error("Erreurs lors de du chargement des clients")
            history.replace("/invoices")
            //TODO : flash
        }
    }

    const fetchInvoice = async (id) => {

        try{
         
            const {amount, status, customer} = await Find(id)
            setInvoice({ amount, status, customer: customer.id })
        }catch (e){
            toast.error("Erreurs lors de du chargement de la  facture demande")

           history.replace("/invoices")
        }
    }

    
    useEffect(() => {
        fetchCustomers()
    }, [])

    //recuparation d'une facture en fonction de l'identifiant
    useEffect(() => {
        if( id !== "new"){
            setEditing(true)
            fetchInvoice(id)
        }
    }, [id])

    return (    
        <>
           {editing ?  <h1>Modification de Facture</h1> :  <h1>Création de Facture</h1>}

            <form onSubmit={handleSubmit}>
                <Field
                    name="amount"
                    type="number"
                    placeholder="Montant de la facture"
                    label="Montant"
                    onChange={handleChange}
                    value={invoice.amount}
                    error={errors.amount}
                />

                <Select
                    name="customer"
                    label="Client"
                    value={invoice.customer}
                    error={errors.customer}
                    onChange={handleChange}
                >
                    {customers.map(customer => 
                        (<option 
                            key={customer.id} 
                            value={customer.id}
                        >
                            {customer.lastname} {customer.firstname} 
                        </option>)
                        )}
                </Select>

                <Select
                    name="status"
                    label="Status"
                    error={errors.status}
                    onChange={handleChange}
                    value={invoice.status}
                >
                    <option value="SENT">Enoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>

                <div className="form-group">
                    <button type="submit" className="btn btn-primary">{!editing ? "Enregistrer" : "Modifier"}</button>
                    <Link to="/invoices" className="btn btn-link">Retour aux factures</Link>
                </div>
            </form>
        </>
     );
}
 
export default Invoice;