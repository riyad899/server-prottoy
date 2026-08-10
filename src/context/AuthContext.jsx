import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('ecom_crm_token'));
  const [loading, setLoading] = useState(true);
  const { success, error: toastError, info } = useToast();

  // Load user profile on startup if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await api.auth.getMe();
          setUser(res.user);
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          localStorage.removeItem('ecom_crm_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.auth.login({ email, password });
      localStorage.setItem('ecom_crm_token', res.token);
      setToken(res.token);
      setUser(res.user);
      success(`Welcome back, ${res.user.name}!`);
      return res.user;
    } catch (err) {
      toastError(err.message || 'Login failed.');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.auth.register(userData);
      localStorage.setItem('ecom_crm_token', res.token);
      setToken(res.token);
      setUser(res.user);
      success(`Account created! Welcome, ${res.user.name}.`);
      return res.user;
    } catch (err) {
      toastError(err.message || 'Registration failed.');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('ecom_crm_token');
    setToken(null);
    setUser(null);
    info('You have logged out.');
  };

  const switchDemoAccount = async (role) => {
    try {
      const res = await api.auth.demoLogin(role);
      localStorage.setItem('ecom_crm_token', res.token);
      setToken(res.token);
      setUser(res.user);
      success(`Switched to Demo ${role === 'admin' ? 'Admin / Manager' : 'Customer'} account.`);
      return res.user;
    } catch (err) {
      toastError(err.message || 'Failed to switch demo account.');
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        login,
        register,
        logout,
        switchDemoAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
