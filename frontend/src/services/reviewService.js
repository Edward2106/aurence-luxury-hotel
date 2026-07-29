import { api } from './api.js';

export const reviewService = {
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  getHotelReviews: async (hotelId) => {
    const response = await api.get(`/reviews/hotel/${hotelId}`);
    return response.data;
  },
};
