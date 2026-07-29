import { Booking, Hotel, Room, RoomType, User, Review, Employee, Invoice, Setting } from '../models/index.js';
import { createNotificationHelper } from './notificationController.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });
    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    await user.update({ status: req.body.status });
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    await user.destroy();
    return res.json({ message: 'Xóa người dùng thành công.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        User,
        { model: Room, include: [Hotel, RoomType] },
        Invoice,
      ],
      order: [['createdAt', 'DESC']],
    });
    return res.json({ bookings });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Không tìm thấy đặt phòng.' });

    const newStatus = req.body.status;
    await booking.update({ status: newStatus });

    if (booking.roomId) {
      if (newStatus === 'checked_in') {
        await Room.update({ status: 'occupied' }, { where: { id: booking.roomId } });
      } else if (newStatus === 'checked_out' || newStatus === 'completed' || newStatus === 'cancelled') {
        await Room.update({ status: 'available' }, { where: { id: booking.roomId } });
      }
    }

    if (newStatus === 'checked_out' || newStatus === 'completed') {
      await Invoice.update({ paymentStatus: 'paid' }, { where: { bookingId: booking.id } });
    }

    if (booking.userId) {
      const statusLabels = {
        confirmed: 'Xác Nhận',
        checked_in: 'Check-In',
        checked_out: 'Check-Out',
        completed: 'Hoàn Tất',
        cancelled: 'Đã Hủy',
      };
      createNotificationHelper({
        userId: booking.userId,
        type: `booking_${newStatus}`,
        title: 'Cập Nhật Trạng Thái Đặt Phòng',
        message: `Đơn đặt phòng ${booking.bookingCode} đã được chuyển sang trạng thái: ${statusLabels[newStatus] || newStatus}.`,
        relatedEntityType: 'booking',
        relatedEntityId: booking.id,
      });
    }

    return res.json({ booking });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({ include: [Hotel] });
    return res.json({ employees });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    return res.status(201).json({ employee });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Không tìm thấy nhân viên.' });
    await employee.update(req.body);
    return res.json({ employee });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Không tìm thấy nhân viên.' });
    await employee.destroy();
    return res.json({ message: 'Xóa nhân viên thành công.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({ include: [Booking] });
    return res.json({ invoices });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Không tìm thấy hóa đơn.' });
    await invoice.update(req.body);
    return res.json({ invoice });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({ include: [User, Hotel, Booking] });
    return res.json({ reviews });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const review = await Review.create({
      ...req.body,
      userId: req.user ? req.user.id : req.body.userId,
    });
    return res.status(201).json({ review });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ message: 'Không tìm thấy đánh giá.' });
    await review.update(req.body);
    return res.json({ review });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ message: 'Không tìm thấy đánh giá.' });
    await review.destroy();
    return res.json({ message: 'Xóa đánh giá thành công.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.findAll();
    return res.json({ settings });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateSetting = async (req, res) => {
  try {
    const { key, value } = req.body;
    let setting = await Setting.findOne({ where: { settingKey: key } });
    if (setting) {
      await setting.update({ settingValue: value });
    } else {
      setting = await Setting.create({ settingKey: key, settingValue: value });
    }
    return res.json({ setting });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
