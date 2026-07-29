import { api } from './api.js';

export const serviceService = {
  getServices: async (params) => {
    const response = await api.get('/services', { params });
    return response.data;
  },

  orderService: async (data) => {
    const response = await api.post('/service-orders', data);
    return response.data;
  },
};
