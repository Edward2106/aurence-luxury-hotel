import { Router } from 'express';
import { getHotels, getHotelById, createHotel, updateHotel, deleteHotel } from '../controllers/hotelController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getHotels);
router.get('/:id', getHotelById);
router.post('/', protect, createHotel);
router.put('/:id', protect, updateHotel);
router.delete('/:id', protect, deleteHotel);

export default router;
