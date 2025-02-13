// import api from './api';

// const authService = {
//   login: async (email, password) => {

//     try {
   
//     const response = await api.post('/users/login', { email, password });
//     // console.log('responseeee',response)
//     return response.data;
//     }
//     catch (err){
 
//       console.error(err)
//     }
//   },
//   signup: async (name, email, password) => {

//     try {
//     const response = await api.post('/users/signup', { name, email, password });
//     // console.log('response',response)
//     return response.data;
//     }
//     catch (err){
//       // console.log(err.response.data.message)
//       console.error(err.response.data.message)
//     }
//   },
// };

// export default authService;

import axios from 'axios';
import api from './api';

const authService = {
  login: async (email, password) => {

    try {
   
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`, { email, password });
    // console.log('responseeee',response)
    return response.data;
    }
    catch (err){
 
      console.error(err)
    }
  },
  signup: async (name, email, password) => {

    try {
    const response = await api.post('/users/signup', { name, email, password });
    // console.log('response',response)
    return response.data;
    }
    catch (err){
      // console.log(err.response.data.message)
      console.error(err.response.data.message)
    }
  },
};

export default authService;

