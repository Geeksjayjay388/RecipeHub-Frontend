import api from './api';

// Get current authenticated user
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

// Get user profile with full details including createdAt
export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Get user's starred recipes
export const getStarredRecipes = async () => {
  try {
    const response = await api.get('/users/starred');
    return response.data;
  } catch (error) {
    console.error('Error fetching starred recipes:', error);
    throw error;
  }
};

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Register user
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
};

// Get user statistics
export const getUserStats = async () => {
  try {
    const response = await api.get('/users/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    // Return default stats if endpoint doesn't exist
    return {
      totalRecipesCreated: 0,
      totalReviews: 0,
      weeklyActivity: 0,
      recipesViewed: 0
    };
  }
};

// Get active users count (for admin dashboard)
export const getActiveUsersCount = async () => {
  try {
    const response = await api.get('/users/active-count');
    return response.data;
  } catch (error) {
    console.error('Error fetching active users count:', error);
    // Return default if endpoint doesn't exist
    return { count: 0 };
  }
};

// Get total users count (for admin dashboard)
export const getUsersCount = async () => {
  try {
    const response = await api.get('/users/count');
    return response.data;
  } catch (error) {
    console.error('Error fetching users count:', error);
    return { count: 0 };
  }
};

// Get all users (for admin dashboard)
export const getAllUsers = async (params = {}) => {
  try {
    const response = await api.get('/users', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

// Delete user (admin only)
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Update user role (admin only)
export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};