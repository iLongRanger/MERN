// function that will take the token 
// if the token is there then it will add it to the headers 
// if not then it will be deleted from the headers

import axios from 'axios';

const setAuthToken = token => {
    if(token) { 
        axios.defaults.headers.common['x-auth-token'] = token;
    }else {
        delete axios.defaults.headers.common['x-auth-token']
    }
}


export default setAuthToken;