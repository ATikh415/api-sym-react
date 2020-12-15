import axios from 'axios';
import Cache from './cache';
import {CUSTOMERS_API} from './config'

const url = CUSTOMERS_API

export async function FindAll(){

    const customersCached = await Cache.get("customers")

    if (customersCached) return customersCached

    return axios
    .get(url)
    .then(response => {
        const customers = response.data['hydra:member']
        Cache.set("customers", customers)
        return customers
    })
}

export function deleteCustomer(id) {
    return axios
            .delete(url + "/" + id)
            .then(async response => {
                const customersCached = await Cache.get("customers")
                 if(customersCached){
                     Cache.set("customers", customersCached.filter(c => c.id !== id))
                 }

                 return response
            })
}

export async function Find(id) {

    const customerCached =await Cache.get("customers." + id)

    if(customerCached) return customerCached

    return axios
    .get(url + "/" + id)
    .then(response => {
        const customer = response.data
        Cache.set("customers." + id, customer)

        return customer
    })
}

export function Update(id, customer){
    return axios
        .put(url + "/" + id, customer)
        .then(async response => {
            const customersCached = await Cache.set("customers")
            const customerCached = await Cache.set("customers." + id)

            if(customerCached){
                Cache.set("customers." + id, response.data)
            }

            if(customersCached){
                const index = customersCached.findIndex(c => c.id === +id)

                customersCached[index] = response.data 
            } 
            return response
        })
}

export function Create(customer){
    return  axios
    .post(url, customer)
    .then(async response => {
        const customersCached =await Cache.get("customers")
        if(customersCached){
            Cache.set("customers", [ response.data, ...customersCached])
        }
        return response
    })
}