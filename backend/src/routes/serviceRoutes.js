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
import { protect, admin } from '../middleware/authMiddleware.js';

const router = Router();

// Public catalogue routes
router.get('/', getServices);
router.get('/:id', getServiceById);

// Protected customer service routes
router.get('/orders/my', protect, getServiceOrders);
router.get('/orders', protect, getServiceOrders);
router.post('/orders', protect, orderService);
router.post('/bookings', protect, orderService);
router.post('/:id/book', protect, orderService);

// Admin-only management routes
router.post('/', protect, admin, createService);
router.put('/:id', protect, admin, updateService);
router.delete('/:id', protect, admin, deleteService);

export default router;
