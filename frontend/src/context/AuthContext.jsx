import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('aurence_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('aurence_token');
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      authService
        .getMe()
        .then((res) => {
          if (res.user) {
            setCurrentUser(res.user);
            localStorage.setItem('aurence_user', JSON.stringify(res.user));
          }
        })
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      if (data.token) {
        setToken(data.token);
        setCurrentUser(data.user);
        localStorage.setItem('aurence_token', data.token);
        localStorage.setItem('aurence_user', JSON.stringify(data.user));
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.register(userData);
      if (data.token) {
        setToken(data.token);
        setCurrentUser(data.user);
        localStorage.setItem('aurence_token', data.token);
        localStorage.setItem('aurence_user', JSON.stringify(data.user));
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Ignored
    } finally {
      setCurrentUser(null);
      setToken(null);
      localStorage.removeItem('aurence_token');
      localStorage.removeItem('aurence_user');
    }
  };

  const role = (currentUser?.role || '').toLowerCase();
  const isAdmin = role === 'admin';
  const isAuthenticated = !!token && !!currentUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        role,
        login,
        register,
        logout,
        loading,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
