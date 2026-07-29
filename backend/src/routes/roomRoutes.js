import { Router } from 'express';
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomTypes,
  createRoomType,
  updateRoomType,
  deleteRoomType,
} from '../controllers/roomController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/types', getRoomTypes);
router.post('/types', protect, createRoomType);
router.put('/types/:id', protect, updateRoomType);
router.delete('/types/:id', protect, deleteRoomType);

router.get('/', getRooms);
router.get('/:id', getRoomById);
router.post('/', protect, createRoom);
router.put('/:id', protect, updateRoom);
router.delete('/:id', protect, deleteRoom);

export default router;
