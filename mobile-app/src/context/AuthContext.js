import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const storedUser = await AsyncStorage.getItem('userData');
      
      if (token && storedUser) {
        // Validate token by fetching profile
        const response = await api.get('/auth/me');
        const profile = response.data; // Backend returns user object in 'data'
        
        // Normalize role for frontend
        const normalizedRole = profile.role.charAt(0).toUpperCase() + profile.role.slice(1);
        const userData = { ...profile, role: normalizedRole, token };

        setUser(userData);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
      }
    } catch (e) {
      console.log('Restoring token failed', e);
      // If profile fetch fails, logout
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.post('/auth/login', { email, password });
      // Backend returns { success: true, data: { user, token } }
      const { user: userData, token } = response.data;
      
      const normalizedRole = userData.role.charAt(0).toUpperCase() + userData.role.slice(1);
      const userWithToken = { ...userData, role: normalizedRole, token };

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userWithToken));
      setUser(userWithToken);
      return true;
    } catch (e) {
      setError(e.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.post('/auth/register', userData);
      // Backend returns { success: true, data: { user, token } }
      const { user: registeredUser, token } = response.data;
      
      const normalizedRole = registeredUser.role.charAt(0).toUpperCase() + registeredUser.role.slice(1);
      const userWithToken = { ...registeredUser, role: normalizedRole, token };

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userWithToken));
      setUser(userWithToken);
      return true;
    } catch (e) {
      setError(e.message || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);
  
  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      setUser(null);
    } catch (e) {
      console.log('Logout error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};
