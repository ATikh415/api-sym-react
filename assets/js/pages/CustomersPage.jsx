import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TableLoader from '../components/loaders/TableLoader';
import Pagination from '../components/Pagination';
import { deleteCustomer, FindAll } from '../services/customersApi';


const CustomersPage = (props) => {

    const [customers, setCustomers] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)

    //permet d'aller recuperer les customers
    const fetchCustomers = async () => {
        try{
            const data = await FindAll()
            setCustomers(data)
            setLoading(false)
        }catch (error){
            console.log(error.response)
        }
    }

    //au chargement du composant on charge les customers
    useEffect(() =>{
      fetchCustomers()
    }, [])

    //Gestion de la suppression du customers
    const handleDelete = async (id) => {

        const originalCustomers = [ ...customers]

        setCustomers(customers.filter(customer => customer.id !== id))
        try{
            await deleteCustomer(id)
        }catch(error) {
            setCustomers(originalCustomers)
        }
        
    }

    const handlePageChange = page => { 
        setCurrentPage(page)
    }

    //Gestion de recherche
    const handleSearchChange = ({ currentTarget }) => {
        setSearch(currentTarget)
        setCurrentPage(1)
    }

    const itemPerPage = 5

    //Filtrage des donnees
    //const filteredCustomers = customers.filter(
    //    c => 
    //        c.firstName.toLowerCase().includes(search.toLowerCase()) ||
    //        c.lastName.toLowerCase().includes(search.toLowerCase())
    //)

    //Pagination des donnees
    const paginadCustomers = Pagination.getData(
            customers,
            currentPage, 
            itemPerPage
        )

    return ( 
        <>
            <div className="mb-2 d-flex justify-content-between align-items-center">
                <h1>Liste des customers</h1> 
                <Link to="/customers/new" className="btn btn-primary" >Créer un client</Link>

            </div>
             <div className="form-group">
                 <input type="text" 
                    onChange={handleSearchChange} 
                    value={search} 
                    className="form-control" 
                    placeholder="Rechercher ..." 
                />
             </div>

             <table className="table table-hover">
                 <thead>
                     <tr>
                         <th>Id</th>
                         <th>Client</th>
                         <th>Email</th>
                         <th>Entreprise</th>
                         <th className="text-center">Facture</th>
                         <th className="text-center">Montant total</th>
                     </tr>
                 </thead>
                {!loading && <tbody>
                     {paginadCustomers.map(customer => 
                         <tr key={customer.id}>
                         <td>{customer.id}</td>
                         <td>
                            <Link to={"/customers/" + customer.id} > {customer.firstname} {customer.lastname}</Link>
                         </td>
                         <td>{customer.email}</td>
                         <td>{ customer.company && customer.company}</td>
                         <td className="text-center">
                             <span className="badge badge-primary">5</span>
                         </td>
                         <td className="text-center">{customer.totalAmount } $</td>
                         <td>
                             <button
                                onClick={() => handleDelete(customer.id)}
                                className="btn btn-sm btn-danger">
                                  Supprimer
                            </button>
                         </td>
                     </tr>
                    )}
                    
                 </tbody> }

             </table>

            { loading && <TableLoader /> }

            { itemPerPage < customers.length && (
                <Pagination 
                    currentPage={currentPage} 
                    OnPageChange={handlePageChange} 
                    length={customers.length} 
                    itemPerPage={itemPerPage} 
                />)
            }
            
        </>
    );
}
 
export default CustomersPage;