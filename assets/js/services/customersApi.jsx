import axios from 'axios';

const url = "http://localhost:8000/api/customers"

export function FindAll(){
    return axios
    .get(url)
    .then(response => response.data['hydra:member'])
}

export function deleteCustomer(id) {
    return axios.delete(url + "/" + id)
}

export function Find(id) {
    return axios
    .get(url + "/" + id)
    .then(response => response.data)
}

export function Update(id, customer){
    return axios
    .put(url + "/" + id, customer)
}

export function Create(customer){
    return  axios
    .post(url, customer)
}