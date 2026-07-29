import { Router } from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  orderService,
  getServiceOrders,
} from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getServices);
router.get('/orders', protect, getServiceOrders);
router.post('/orders', protect, orderService);
router.get('/:id', getServiceById);
router.post('/', protect, createService);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

export default router;
