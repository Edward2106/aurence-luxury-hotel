import { Router } from 'express';
import { createCustomerReview, getHotelReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect, createCustomerReview);
router.get('/hotel/:hotelId', getHotelReviews);

export default router;
