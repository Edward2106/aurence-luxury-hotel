import { Router } from 'express';
import { getHotels, getHotelById, getRoomTypesByHotel, createHotel, updateHotel, deleteHotel } from '../controllers/hotelController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = Router();

router.get('/', getHotels);
router.get('/:id', getHotelById);
router.get('/:hotelId/room-types', getRoomTypesByHotel);
router.post('/', protect, adminOnly, createHotel);
router.put('/:id', protect, adminOnly, updateHotel);
router.delete('/:id', protect, adminOnly, deleteHotel);

export default router;
