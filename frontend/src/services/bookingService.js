import { api } from './api.js';

export const bookingService = {
  createBooking: async (data) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  getMyBookings: async (status) => {
    const response = await api.get('/bookings/my-bookings', { params: { status } });
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  cancelBooking: async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  },

  getAllBookings: async (params) => {
    const response = await api.get('/admin/bookings', { params });
    return response.data;
  },

  checkIn: async (id) => {
    const response = await api.put(`/admin/bookings/${id}/check-in`);
    return response.data;
  },

  checkOut: async (id) => {
    const response = await api.put(`/admin/bookings/${id}/check-out`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/admin/bookings/${id}/status`, { status });
    return response.data;
  },

  payInvoice: async (id) => {
    const response = await api.put(`/bookings/${id}/pay`);
    return response.data;
  },
};
