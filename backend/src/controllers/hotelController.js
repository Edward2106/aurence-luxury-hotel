import { Hotel, RoomType, Room, Review, Booking } from '../models/index.js';
import { Op } from 'sequelize';

export const getHotels = async (req, res) => {
  try {
    const { keyword, city, checkInDate, checkOutDate, guestCount } = req.query;

    const whereClause = { status: 'active' };

    if (keyword) {
      const searchKey = `%${keyword.trim()}%`;
      whereClause[Op.or] = [
        { name: { [Op.like]: searchKey } },
        { city: { [Op.like]: searchKey } },
        { address: { [Op.like]: searchKey } },
        { description: { [Op.like]: searchKey } },
      ];
    }

    if (city) {
      whereClause.city = { [Op.like]: `%${city.trim()}%` };
    }

    const roomTypeWhere = {};
    if (guestCount) {
      const count = parseInt(guestCount, 10);
      if (!isNaN(count) && count > 0) {
        roomTypeWhere.capacity = { [Op.gte]: count };
      }
    }

    const hotels = await Hotel.findAll({
      where: whereClause,
      include: [
        {
          model: RoomType,
          where: Object.keys(roomTypeWhere).length > 0 ? roomTypeWhere : undefined,
          required: false,
        },
        { model: Room },
        { model: Review, where: { status: 'visible' }, required: false },
      ],
    });

    const formattedHotels = hotels.map((h) => {
      const plain = h.toJSON();
      const reviews = plain.Reviews || [];
      const totalScore = reviews.reduce((sum, r) => sum + (r.overallRating || 5), 0);
      const avgRating = reviews.length > 0 ? (totalScore / reviews.length).toFixed(1) : plain.starRating || 5;

      return {
        ...plain,
        averageRating: parseFloat(avgRating),
        reviewCount: reviews.length,
      };
    });

    return res.json({ hotels: formattedHotels });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id, {
      include: [
        { model: RoomType },
        { model: Room },
        {
          model: Review,
          where: { status: 'visible' },
          required: false,
          include: ['User'],
        },
      ],
    });

    if (!hotel) return res.status(404).json({ message: 'Khách sạn không tồn tại.' });

    const plain = hotel.toJSON();
    const reviews = plain.Reviews || [];
    const totalScore = reviews.reduce((sum, r) => sum + (r.overallRating || 5), 0);
    const avgRating = reviews.length > 0 ? (totalScore / reviews.length).toFixed(1) : plain.starRating || 5;

    return res.json({
      hotel: {
        ...plain,
        averageRating: parseFloat(avgRating),
        reviewCount: reviews.length,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createHotel = async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    }
    const hotel = await Hotel.create(data);
    return res.status(201).json({ hotel });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Khách sạn không tồn tại.' });
    await hotel.update(req.body);
    return res.json({ hotel });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Khách sạn không tồn tại.' });
    await hotel.destroy();
    return res.json({ message: 'Xóa khách sạn thành công.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
