import { api } from './api.js';

export const hotelService = {
  getHotels: async (params) => {
    const response = await api.get('/hotels', { params });
    return response.data;
  },

  getHotelById: async (id) => {
    const response = await api.get(`/hotels/${id}`);
    return response.data;
  },

  createHotel: async (data) => {
    const response = await api.post('/admin/hotels', data);
    return response.data;
  },

  updateHotel: async (id, data) => {
    const response = await api.put(`/admin/hotels/${id}`, data);
    return response.data;
  },

  deleteHotel: async (id) => {
    const response = await api.delete(`/admin/hotels/${id}`);
    return response.data;
  },
};
