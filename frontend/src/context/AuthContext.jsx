import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          fetchProfile();
        } else {
          logout();
        }
      } catch (err) {
        logout();
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';
      const res = await axios.get(`${API_BASE_URL}/api/auth/profile`);
      setUser(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';
    const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setUser(res.data);
  };

  const register = async (name, email, password, monthlyBudget) => {
    const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';
    const res = await axios.post(`${API_BASE_URL}/api/auth/register`, { name, email, password, monthlyBudget });
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setUser(res.data);
  };

  const updateUser = async (userData) => {
    const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';
    const res = await axios.put(`${API_BASE_URL}/api/auth/profile`, userData);
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setUser(res.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
