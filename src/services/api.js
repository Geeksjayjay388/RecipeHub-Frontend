import axios from 'axios';

const API_URL = 'http://localhost:5500/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - REMOVE THE TOAST CALL
api.interceptors.response.use(
  (response) => {
    console.log(`📥 Response ${response.status}:`, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      code: error.code
    });
    
    // Remove toast error - it's not defined here
    if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Network error - Backend might not be running on port 5500');
      // We'll handle this in the component
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;