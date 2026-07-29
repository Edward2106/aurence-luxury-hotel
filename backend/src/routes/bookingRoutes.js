import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  deleteBooking,
  payBookingInvoice,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);
router.get('/:id', getBookingById);
router.put('/:id', updateBooking);
router.put('/:id/cancel', cancelBooking);
router.put('/:id/pay', payBookingInvoice);
router.delete('/:id', deleteBooking);

export default router;
