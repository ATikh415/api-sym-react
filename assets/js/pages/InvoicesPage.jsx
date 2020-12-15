import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import Pagination from '../components/Pagination';
import { Link } from 'react-router-dom';
import TableLoader from '../components/loaders/TableLoader';


const InvoicesPage = (props) => {

    const CLASS_STATUS = {
        PAID: 'success',
        SENT: 'primary',
        CANCELLED: 'danger'
    }
    
    const LIBEL_STATUS = {
        PAID: 'payée',
        SENT: 'envoyée',
        CANCELLED: 'annulée'
    }

    const [invoices, setInvoices] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)

    const fetchInvoices = async () => {
        try{
            const data = await axios
            .get("http://localhost:8000/api/invoices")
            .then(response => response.data["hydra:member"])
            setLoading(false)
            setInvoices(data)
        } catch (error) {
            toast.error("Erreurs lors de du chargement des factues")
        }
    }

    useEffect(() => {
        fetchInvoices()
    }, []) 

    const handlePageChange = page => { 
        setCurrentPage(page)
    }

     //Gestion de recherche
     const handleSearchChange = ({ currentTarget }) => {
        setSearch(currentTarget)
        setCurrentPage(1)
    }

    
    //Filtrage des donnees
   // const filteredInvoices = invoices.filter(
   //     i => 
   //         i.firstName.toLowerCase().start(search.toLowerCase()) ||
   //         i.lastName.toLowerCase().includes(search.toLowerCase())
   // )

    const itemPerPage = 5

    //Pagination des donnees
    const invoicesPaginated = Pagination.getData(
        invoices,
        currentPage, 
        itemPerPage
    )

    const formatDate = (str) => moment(str).format('DD/MM/YYYY')

    return ( 
        <>

            <div className="form-group">
                 <input type="text" 
                    onChange={handleSearchChange} 
                    value={search} 
                    className="form-control" 
                    placeholder="Rechercher ..." 
                />
             </div>

            <div className="d-flex justify-content-between align-items-center">
                <h1>Liste des factures</h1>
                <Link to="/invoices/new" className="btn btn-primary">Créer un facture</Link>
            </div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className="text-center">Date d'envoi</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>
                {!loading && <tbody>
                    {invoicesPaginated.map(invoice => 
                        <tr key={invoice.id}>
                            <td>{invoice.id}</td>
                            <td>
                                <a href="">{invoice.customer.firstname} {invoice.customer.lastname}</a> 
                            </td>
                            <td className="text-center">{formatDate(invoice.sentAt)}</td>
                            <td className="text-center">
                                <span className={"badge badge-" + CLASS_STATUS[invoice.status]}>
                                    {LIBEL_STATUS[invoice.status]}
                                </span>
                            </td>
                             <td className="text-center"> { invoice.amount }$</td>
                            <td>
                                <Link to={"/invoices/" + invoice.id} className="btn btn-sm btn-primary mr-1 ">Editer</Link>
                                <button className="btn btn-sm btn-danger">Supprimer</button>
                            </td>
                        </tr>    
                    )}
                </tbody> } 
            </table>

            {loading && <TableLoader />}

            <Pagination itemPerPage={itemPerPage} currentPage={currentPage} OnPageChange={handlePageChange} length={invoices.length} />
        </>
     );
}
 
export default InvoicesPage;