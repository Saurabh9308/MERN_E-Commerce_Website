// utils/axiosConfig.js
import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: "http://localhost:8080/api",
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