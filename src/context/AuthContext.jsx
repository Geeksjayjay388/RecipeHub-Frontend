import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService, register as registerService, logout as logoutService, getCurrentUser } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ FIXED - Make this async and await the user data
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginService({ email, password });
      setUser(data.user);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await registerService({ name, email, password });
      setUser(data.user);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateUser,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};