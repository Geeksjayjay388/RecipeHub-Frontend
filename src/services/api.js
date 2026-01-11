import axios from 'axios';

const API_URL = 'https://recipehub-backend-y2ax.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.erlror('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - NO REDIRECTS HERE
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Clear token on 401 but DON'T redirect
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('Token cleared due to 401 error');
    }
    
    return Promise.reject(error);
  }
);

export default api;