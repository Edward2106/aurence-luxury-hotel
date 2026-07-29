import { Router } from 'express';
import {
  getUsers,
  updateUserStatus,
  deleteUser,
  getAllBookings,
  updateBookingStatus,
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getInvoices,
  updateInvoice,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  getSettings,
  updateSetting,
} from '../controllers/adminController.js';
import { createHotel, deleteHotel } from '../controllers/hotelController.js';
import { Booking, Room, User, Invoice, Review } from '../models/index.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { Op } from 'sequelize';

const router = Router();

router.use(protect, adminOnly);

router.get('/dashboard', async (req, res) => {
  try {
    const totalBookings = await Booking.count();
    const totalUsers = await User.count();
    const totalRooms = await Room.count();
    const occupiedRooms = await Room.count({ where: { status: 'occupied' } });
    const availableRooms = await Room.count({ where: { status: 'available' } });
    const totalReviews = await Review.count();

    const paidInvoices = await Invoice.findAll({ where: { paymentStatus: 'paid' } });
    let totalRevenue = paidInvoices.reduce((acc, inv) => acc + parseFloat(inv.totalAmount || 0), 0);
    if (totalRevenue === 0) {
      const validBookings = await Booking.findAll({ where: { status: { [Op.ne]: 'cancelled' } } });
      totalRevenue = validBookings.reduce((acc, b) => acc + parseFloat(b.totalAmount || 0), 0);
    }

    const activeBookings = await Booking.count({ where: { status: ['pending', 'confirmed', 'checked_in'] } });
    const effectiveOccupied = occupiedRooms > 0 ? occupiedRooms : Math.min(activeBookings, totalRooms);
    const occupancyRate = totalRooms > 0 ? ((effectiveOccupied / totalRooms) * 100).toFixed(1) : '0.0';

    res.json({
      totalRevenue,
      totalBookings,
      totalUsers,
      totalRooms,
      occupiedRooms: effectiveOccupied,
      availableRooms,
      totalReviews,
      occupancyRate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Users
router.get('/users', getUsers);
router.get('/customers', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// Bookings
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);

// Hotels
router.post('/hotels', createHotel);
router.delete('/hotels/:id', deleteHotel);

// Employees
router.get('/employees', getEmployees);
router.post('/employees', createEmployee);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deleteEmployee);

// Invoices
router.get('/invoices', getInvoices);
router.put('/invoices/:id', updateInvoice);

// Reviews
router.get('/reviews', getReviews);
router.post('/reviews', createReview);
router.put('/reviews/:id', updateReview);
router.delete('/reviews/:id', deleteReview);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSetting);

export default router;
