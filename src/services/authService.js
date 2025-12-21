import api from './api';

// Register user
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

// Login user
export const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Get all users (Admin)
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// Get users count (Admin)
export const getUsersCount = async () => {
  try {
    const response = await api.get('/users/count');
    return response.data;
  } catch (error) {
    // Fallback: get all users and count them
    const users = await getAllUsers();
    return { count: users.users?.length || users.length || 0 };
  }
};

// Get starred recipes
export const getStarredRecipes = async () => {
  const response = await api.get('/users/starred-recipes');
  return response.data;
};

// Update profile
export const updateProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Get user profile
export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};