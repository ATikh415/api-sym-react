import React from 'react';
import axios from 'axios';


export function Find(id) {
    return axios
        .get("http://localhost:8000/api/invoices/" + id )
        .then(response => response.data)
    
}
 
export const Update = (id, invoice) => {
    return axios
        .put("http://localhost:8000/api/invoices/" + id, 
        { ...invoice, customer: `/api/customers/${invoice.customer}`}
)
}

export const Create = (invoice) => {
    return axios
        .post("http://localhost:8000/api/invoices", 
        { ...invoice, customer: `/api/customers/${invoice.customer}`}
    )
}
