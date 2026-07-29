import { Review, Booking, Hotel, User, Room } from '../models/index.js';

export const createCustomerReview = async (req, res) => {
  try {
    const {
      bookingId,
      overallRating,
      roomRating,
      staffRating,
      cleanlinessRating,
      foodRating,
      comment,
      imageUrl,
    } = req.body;

    if (!bookingId || !overallRating) {
      return res.status(400).json({ message: 'Vui lòng cung cấp mã đặt phòng và điểm đánh giá.' });
    }

    const rating = parseInt(overallRating, 10);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Điểm đánh giá phải từ 1 đến 5 sao.' });
    }

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng.' });
    }

    if (booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'Bạn chỉ có thể đánh giá đơn đặt phòng của chính mình.' });
    }

    const status = (booking.status || '').toLowerCase();
    if (status !== 'checked_out' && status !== 'completed' && status !== 'confirmed' && status !== 'pending') {
      return res.status(400).json({
        message: 'Bạn chỉ có thể viết đánh giá sau khi hoàn tất lưu trú hoặc đã Check-Out.',
      });
    }

    const existingReview = await Review.findOne({ where: { bookingId } });
    if (existingReview) {
      return res.status(400).json({ message: 'Bạn đã gửi đánh giá cho đơn đặt phòng này rồi.' });
    }

    let hotelId = booking.hotelId;
    if (!hotelId && booking.roomId) {
      const room = await Room.findByPk(booking.roomId);
      if (room) hotelId = room.hotelId;
    }

    const review = await Review.create({
      userId: req.user.id,
      hotelId: hotelId || 1,
      bookingId: booking.id,
      overallRating: rating,
      roomRating: roomRating ? parseInt(roomRating, 10) : null,
      staffRating: staffRating ? parseInt(staffRating, 10) : null,
      cleanlinessRating: cleanlinessRating ? parseInt(cleanlinessRating, 10) : null,
      foodRating: foodRating ? parseInt(foodRating, 10) : null,
      comment: comment || null,
      imageUrl: imageUrl || null,
      status: 'visible',
    });

    return res.status(201).json({
      message: 'Gửi đánh giá thành công. Cảm ơn phản hồi của bạn!',
      review,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getHotelReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: {
        hotelId: req.params.hotelId,
        status: 'visible',
      },
      include: [
        {
          model: User,
          attributes: ['id', 'fullName', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
    return res.json({ reviews });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
