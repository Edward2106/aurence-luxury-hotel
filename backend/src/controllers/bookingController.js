import { Booking, Room, RoomType, Hotel, Invoice, User, sequelize } from '../models/index.js';
import { Op } from 'sequelize';
import { createNotificationHelper } from './notificationController.js';

export const createBooking = async (req, res) => {
  try {
    const checkInStr = req.body.checkInDate || req.body.checkIn;
    const checkOutStr = req.body.checkOutDate || req.body.checkOut;
    let targetRoomId = req.body.roomId || req.body.roomTypeId;
    const { guestCount, specialRequest } = req.body;

    if (!targetRoomId || !checkInStr || !checkOutStr) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin phòng và ngày lưu trú.' });
    }

    const checkInDate = checkInStr;
    const checkOutDate = checkOutStr;

    let room = await Room.findByPk(targetRoomId, { include: [RoomType] });
    if (!room) {
      room = await Room.findOne({ include: [RoomType] });
      if (room) targetRoomId = room.id;
    }
    const roomId = targetRoomId;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return res.status(400).json({ message: 'Định dạng ngày tháng không hợp lệ.' });
    }

    if (checkIn < today) {
      return res.status(400).json({ message: 'Ngày nhận phòng không thể ở quá khứ.' });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({ message: 'Ngày trả phòng phải sau ngày nhận phòng.' });
    }

    const guests = parseInt(guestCount || 1, 10);
    if (isNaN(guests) || guests <= 0) {
      return res.status(400).json({ message: 'Số lượng khách phải lớn hơn 0.' });
    }

    if (!room) {
      return res.status(404).json({ message: 'Phòng không tồn tại.' });
    }

    if (room.RoomType && guests > room.RoomType.capacity) {
      return res.status(400).json({
        message: `Số lượng khách (${guests}) vượt quá sức chứa tối đa của hạng phòng (${room.RoomType.capacity} khách).`,
      });
    }

    const overlappingBooking = await Booking.findOne({
      where: {
        roomId,
        status: { [Op.ne]: 'cancelled' },
        checkInDate: { [Op.lt]: checkOutDate },
        checkOutDate: { [Op.gt]: checkInDate },
      },
    });

    if (overlappingBooking) {
      return res.status(400).json({
        message: 'Phòng đã được đặt trong khoảng thời gian này. Vui lòng chọn ngày khác hoặc phòng khác.',
      });
    }

    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const basePrice = parseFloat(room.RoomType?.basePrice || 0);
    const roomCharge = basePrice * nights;
    const vatRate = 10;
    const vatAmount = roomCharge * (vatRate / 100);
    const grandTotal = roomCharge + vatAmount;

    const result = await sequelize.transaction(async (t) => {
      const bookingCode = `AUR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newBooking = await Booking.create(
        {
          bookingCode,
          userId: req.user.id,
          roomId,
          checkInDate,
          checkOutDate,
          guestCount: guests,
          roomPrice: basePrice,
          totalAmount: roomCharge,
          status: 'pending',
          specialRequest: specialRequest || null,
        },
        { transaction: t }
      );

      const invoiceCode = `INV-${bookingCode}`;
      const newInvoice = await Invoice.create(
        {
          invoiceCode,
          bookingId: newBooking.id,
          roomCharge,
          serviceCharge: 0,
          vatRate,
          vatAmount,
          totalAmount: grandTotal,
          paymentStatus: 'unpaid',
        },
        { transaction: t }
      );

      return { booking: newBooking, invoice: newInvoice };
    });

    createNotificationHelper({
      userId: req.user.id,
      type: 'booking_created',
      title: 'Đặt Phòng Thành Công',
      message: `Đơn đặt phòng ${result.booking.bookingCode} đã được tạo thành công.`,
      relatedEntityType: 'booking',
      relatedEntityId: result.booking.id,
    });

    createNotificationHelper({
      roleTarget: 'admin',
      type: 'new_booking',
      title: 'Đơn Đặt Phòng Mới',
      message: `Khách hàng vừa đặt phòng mới (${result.booking.bookingCode}).`,
      relatedEntityType: 'booking',
      relatedEntityId: result.booking.id,
    });

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Room,
          include: [Hotel, RoomType],
        },
        Invoice,
      ],
      order: [['created_at', 'DESC']],
    });
    return res.json({ bookings });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: Room, include: [Hotel, RoomType] },
        Invoice,
        User,
      ],
    });

    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin đặt phòng.' });
    }

    if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập đơn đặt phòng này.' });
    }

    return res.json({ booking });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin đặt phòng.' });
    }
    if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa đơn đặt phòng này.' });
    }
    await booking.update(req.body);
    return res.json({ booking });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng.' });
    }

    if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'Bạn không có quyền hủy đơn đặt phòng này.' });
    }

    const currentStatus = (booking.status || '').toLowerCase();
    if (currentStatus !== 'pending' && currentStatus !== 'confirmed') {
      return res.status(400).json({
        message: 'Chỉ có thể hủy đơn đặt phòng ở trạng thái chờ (pending) hoặc đã xác nhận (confirmed).',
      });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    await booking.save();
    return res.json({ message: 'Hủy đơn đặt phòng thành công.', booking });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Không tìm thấy đặt phòng.' });
    await booking.destroy();
    return res.json({ message: 'Xóa đặt phòng thành công.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const payBookingInvoice = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Không tìm thấy đặt phòng.' });

    if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'Bạn không có quyền thanh toán hóa đơn này.' });
    }

    const invoice = await Invoice.findOne({ where: { bookingId: booking.id } });
    if (invoice) {
      if (invoice.paymentStatus === 'paid') {
        return res.status(400).json({ message: 'Hóa đơn này đã được thanh toán trước đó.' });
      }
      await invoice.update({
        paymentStatus: 'paid',
        amountPaid: invoice.totalAmount,
        amountDue: 0,
        paidAt: new Date(),
        paymentMethod: 'e_wallet',
      });
    }

    await booking.update({ paymentStatus: 'paid' });

    createNotificationHelper({
      userId: booking.userId,
      type: 'payment_success',
      title: 'Mô Phỏng Thanh Toán Thành Công',
      message: `Hệ thống đã mô phỏng thanh toán cho đơn đặt phòng ${booking.bookingCode} và cập nhật trạng thái hóa đơn trong cơ sở dữ liệu. Không có giao dịch ngân hàng thực tế.`,
      relatedEntityType: 'invoice',
      relatedEntityId: booking.id,
    });

    createNotificationHelper({
      roleTarget: 'admin',
      type: 'payment_completed',
      title: 'Thanh Toán Mô Phỏng Đã Được Ghi Nhận',
      message: `Khách hàng vừa thực hiện thanh toán mô phỏng cho đơn đặt phòng ${booking.bookingCode}.`,
      relatedEntityType: 'invoice',
      relatedEntityId: booking.id,
    });

    return res.json({ message: 'Mô phỏng thanh toán thành công. Hóa đơn của bạn đã được cập nhật.', booking });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
