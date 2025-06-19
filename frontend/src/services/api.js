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

// candidate endpoints
export const candidateApi = {
  updateProfile: (userId, data) => api.patch(`/candidates/${userId}`, data),
updateSkills: (userId, data) => api.patch(`/candidates/${userId}/skills`, data),
updateWorkHistory: (userId, data) => api.patch(`/candidates/${userId}/work-history`, data),
updateEducation: (userId, data) => api.patch(`/candidates/${userId}/education`, data),

};


export { api };



