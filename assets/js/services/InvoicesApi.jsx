import React from 'react';
import axios from 'axios';
import { INVOIVES_API } from './config';


export function Find(id) {
    return axios
        .get(INVOIVES_API + "/" + id )
        .then(response => response.data)
    
}
 
export const Update = (id, invoice) => {
    return axios
        .put(INVOIVES_API + "/" + id, 
        { ...invoice, customer: `/api/customers/${invoice.customer}`}
)
}

export const Create = (invoice) => {
    return axios
        .post(INVOIVES_API, 
        { ...invoice, customer: `/api/customers/${invoice.customer}`}
    )
}
