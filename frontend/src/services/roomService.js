import { api } from './api.js';

export const roomService = {
  getRooms: async (params) => {
    const response = await api.get('/rooms', { params });
    return response.data;
  },

  getAvailableRooms: async (params) => {
    const response = await api.get('/rooms', { params });
    return response.data;
  },

  createRoom: async (data) => {
    const response = await api.post('/admin/rooms', data);
    return response.data;
  },

  updateRoom: async (id, data) => {
    const response = await api.put(`/admin/rooms/${id}`, data);
    return response.data;
  },

  updateRoomStatus: async (id, status) => {
    const response = await api.patch(`/admin/rooms/${id}/status`, { status });
    return response.data;
  },

  getRoomTypes: async (params) => {
    const response = await api.get('/rooms/types', { params });
    return response.data;
  },

  getRoomTypesByHotel: async (hotelId) => {
    const response = await api.get(`/hotels/${hotelId}/room-types`);
    return response.data;
  },

  deleteRoom: async (id) => {
    const response = await api.delete(`/admin/rooms/${id}`);
    return response.data;
  },
};
