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
    const srv = await Service.findByPk(serviceId);
    if (!srv) return res.status(404).json({ message: 'Không tìm thấy dịch vụ.' });

    const qty = quantity || 1;
    const unitPrice = parseFloat(srv.price);
    const totalPrice = unitPrice * qty;

    const order = await ServiceOrder.create({
      bookingId,
      serviceId,
      quantity: qty,
      unitPrice,
      totalPrice,
      status: 'pending',
    });
    return res.status(201).json({ order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getServiceOrders = async (req, res) => {
  try {
    const orders = await ServiceOrder.findAll({
      include: [Service, Booking],
    });
    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
