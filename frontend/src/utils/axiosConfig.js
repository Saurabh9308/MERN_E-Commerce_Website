// utils/axiosConfig.js
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || "https://auramart-backend-glf6.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear cart from localStorage
      localStorage.removeItem('cart');
      
      // Dispatch event to notify components
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      
      // Don't show toast for every 401, only for specific endpoints
      const excludeUrls = ['/cart', '/auth/me'];
      const shouldShowToast = !excludeUrls.some(url => 
        error.config?.url?.includes(url)
      );
      
      if (shouldShowToast && !error.config?.url?.includes('/cart')) {
        toast.error('Please login to continue');
      }
    }
    return Promise.reject(error);
  }
);

export default api;