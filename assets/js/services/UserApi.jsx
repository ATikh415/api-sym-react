import React from 'react';
import axios from 'axios';
import { USERS_API } from './config';

const Create = () => {
    return axios.post(USERS_API, user)
}
 
export default Create;