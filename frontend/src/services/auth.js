// services/auth.js
import api from './api';

export const authService = {
  // User management
  getAllUsers: async () => {
    const { data } = await api.get('/users');
    console.log("authService.getAllUsers", data);
    return data;
  },

  getUserById: async (id) => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  createUser: async (userData) => {
    const { data } = await api.post('/users', userData);
    return data;
  },

  updateUser: async (id, userData) => {
    const { data } = await api.put(`/users/${id}`, userData);
    return data;
  },

  deleteUser: async (id) => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },

  // Role management
  updateUserRole: async (id, role) => {
    const { data } = await api.put(`/users/${id}/role`, { role });
    return data;
  }
};