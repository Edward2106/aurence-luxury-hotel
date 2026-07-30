import { Service, ServiceOrder, Booking } from '../models/index.js';

export const getServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    return res.json({ services });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ message: 'Không tìm thấy dịch vụ.' });
    return res.json({ service });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    return res.status(201).json({ service });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ message: 'Không tìm thấy dịch vụ.' });
    await service.update(req.body);
    return res.json({ service });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ message: 'Không tìm thấy dịch vụ.' });
    await service.destroy();
    return res.json({ message: 'Xóa dịch vụ thành công.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const orderService = async (req, res) => {
  try {
    const { bookingId, serviceId, quantity } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập để sử dụng dịch vụ.',
      });
    }

    const srv = await Service.findByPk(serviceId);
    if (!srv) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dịch vụ.',
      });
    }

    let targetBookingId = bookingId;

    if (targetBookingId) {
      const booking = await Booking.findByPk(targetBookingId);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn đặt phòng.',
        });
      }

      if (booking.userId !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Bạn không có quyền thực hiện thao tác này.',
        });
      }

      if (booking.status === 'cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Đơn đặt phòng đã hủy không thể đặt thêm dịch vụ.',
        });
      }
    } else {
      const activeBooking = await Booking.findOne({
        where: { userId, status: ['confirmed', 'checked_in', 'pending'] },
        order: [['created_at', 'DESC']],
      });

      if (!activeBooking) {
        return res.status(400).json({
          success: false,
          message: 'Bạn cần có đơn đặt phòng để sử dụng dịch vụ này.',
        });
      }

      targetBookingId = activeBooking.id;
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const unitPrice = parseFloat(srv.price);
    const totalPrice = unitPrice * qty;

    const order = await ServiceOrder.create({
      bookingId: targetBookingId,
      serviceId: srv.id,
      quantity: qty,
      unitPrice,
      totalPrice,
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Đặt dịch vụ thành công.',
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getServiceOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập để sử dụng dịch vụ.',
      });
    }

    if (role === 'admin') {
      const orders = await ServiceOrder.findAll({
        include: [Service, Booking],
        order: [['id', 'DESC']],
      });
      return res.json({ orders });
    }

    const userBookings = await Booking.findAll({
      where: { userId },
      attributes: ['id'],
    });

    const bookingIds = userBookings.map((b) => b.id);

    const orders = await ServiceOrder.findAll({
      where: { bookingId: bookingIds },
      include: [Service, Booking],
      order: [['id', 'DESC']],
    });

    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
