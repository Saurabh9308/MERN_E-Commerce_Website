import axios from 'axios';
axios.defaults.withCredentials = true;
const API = axios.create({ baseURL: 'http://localhost:8080/api/users' });

export const register = (userData) => API.post('/register', userData);
export const login = (userData) => API.post('/login', userData);