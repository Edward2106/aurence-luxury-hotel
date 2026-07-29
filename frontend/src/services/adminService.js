import { api } from './api.js';

export const adminService = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getCustomers: async (params) => {
    const response = await api.get('/admin/customers', { params });
    return response.data;
  },

  getEmployees: async (params) => {
    const response = await api.get('/admin/employees', { params });
    return response.data;
  },

  createEmployee: async (data) => {
    const response = await api.post('/admin/employees', data);
    return response.data;
  },

  updateEmployee: async (id, data) => {
    const response = await api.put(`/admin/employees/${id}`, data);
    return response.data;
  },

  deleteEmployee: async (id) => {
    const response = await api.delete(`/admin/employees/${id}`);
    return response.data;
  },

  getReports: async (params) => {
    const response = await api.get('/admin/reports', { params });
    return response.data;
  },

  getSettings: async () => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  updateSettings: async (data) => {
    const response = await api.put('/admin/settings', data);
    return response.data;
  },

  getReviews: async (params) => {
    const response = await api.get('/admin/reviews', { params });
    return response.data;
  },

  hideReview: async (id) => {
    const response = await api.put(`/admin/reviews/${id}/hide`);
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/admin/reviews/${id}`);
    return response.data;
  },
};
