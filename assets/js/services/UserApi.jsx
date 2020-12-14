import React from 'react';
import axios from 'axios';

const Create = () => {
    return axios.post("http://localhost:8000/api/users", user)
}
 
export default Create;