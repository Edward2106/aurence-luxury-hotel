import { Router } from 'express';
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  updateRoomStatus,
  deleteRoom,
  getRoomTypes,
  createRoomType,
  updateRoomType,
  deleteRoomType,
} from '../controllers/roomController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = Router();

router.get('/types', getRoomTypes);
router.post('/types', protect, adminOnly, createRoomType);
router.put('/types/:id', protect, adminOnly, updateRoomType);
router.delete('/types/:id', protect, adminOnly, deleteRoomType);

router.get('/', getRooms);
router.get('/:id', getRoomById);
router.post('/', protect, adminOnly, createRoom);
router.put('/:id', protect, adminOnly, updateRoom);
router.patch('/:id/status', protect, adminOnly, updateRoomStatus);
router.put('/:id/status', protect, adminOnly, updateRoomStatus);
router.delete('/:id', protect, adminOnly, deleteRoom);

export default router;
