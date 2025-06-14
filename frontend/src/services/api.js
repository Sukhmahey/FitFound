import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// user endpoints
export const userApi = {
  addUser: (data) => api.post('/user', data),
  getUserByEmail: ( data ) => api.get('/user/byemail', { params: data })
};

// login endpoints
export const loginApi = {
  loginUser: (data) => api.post('/login', data )
 };

export { api };



