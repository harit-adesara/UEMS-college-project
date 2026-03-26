import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../api/client';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check current user on load
  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const { data } = await apiClient.get('/get/current/user');
      setUser(data.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await apiClient.post('/login', { email, password });
    setUser(data.data.user);
    return data;
  };

  const logout = async () => {
    await apiClient.post('/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, checkCurrentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
