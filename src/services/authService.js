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

// ✅ Get active users count (Admin)
export const getActiveUsersCount = async () => {
  try {
    const response = await api.get('/users/active-count');
    return response.data;
  } catch (error) {
    // Fallback: return mock data or calculate from all users
    console.warn('Active users endpoint not available, using fallback');
    try {
      const users = await getAllUsers();
      const allUsers = users.users || users;
      
      // Consider users active if they logged in within last 24 hours
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const activeUsers = allUsers.filter(user => {
        const lastLogin = new Date(user.lastLogin || user.updatedAt || user.createdAt);
        return lastLogin > oneDayAgo;
      });
      
      return { count: activeUsers.length };
    } catch (fallbackError) {
      return { count: 0 };
    }
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

// Update user role (Admin)
export const updateUserRole = async (userId, role) => {
  const response = await api.put(`/users/${userId}/role`, { role });
  return response.data;
};

// Delete user (Admin)
export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

// Get user by ID (Admin)
export const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};