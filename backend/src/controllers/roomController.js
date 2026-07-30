import { Room, RoomType, Hotel, Booking } from '../models/index.js';
import { Op } from 'sequelize';

const formatRoomType = (rtInstance) => {
  if (!rtInstance) return null;
  const plain = rtInstance.toJSON ? rtInstance.toJSON() : rtInstance;
  const rawPrice = Number(plain.basePrice || plain.price || plain.pricePerNight);
  const price = Number.isFinite(rawPrice) && rawPrice >= 0 ? rawPrice : null;
  return {
    ...plain,
    basePrice: price,
    pricePerNight: price,
    price: price,
  };
};

const formatRoom = (r) => {
  const plain = r.toJSON ? r.toJSON() : r;
  if (plain.RoomType) {
    plain.RoomType = formatRoomType(plain.RoomType);
    plain.roomType = plain.RoomType;
  }
  if (plain.Hotel) {
    plain.hotel = plain.Hotel;
  }
  return plain;
};

export const getRooms = async (req, res) => {
  try {
    const { hotelId, roomTypeId, status, keyword } = req.query;
    const whereClause = {};

    if (hotelId) whereClause.hotelId = hotelId;
    if (roomTypeId) whereClause.roomTypeId = roomTypeId;
    if (status) whereClause.status = status;
    if (keyword) {
      whereClause.roomNumber = { [Op.like]: `%${keyword.trim()}%` };
    }

    const rooms = await Room.findAll({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      include: [Hotel, RoomType],
      order: [['hotelId', 'ASC'], ['floor', 'ASC'], ['roomNumber', 'ASC']],
    });

    return res.json({ rooms: rooms.map(formatRoom) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id, {
      include: [Hotel, RoomType],
    });
    if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng.' });
    return res.json({ room: formatRoom(room) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createRoom = async (req, res) => {
  try {
    const { hotelId, roomTypeId, roomNumber, floor, status } = req.body;

    if (!hotelId || !roomTypeId || !roomNumber) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ: Khách sạn, Hạng phòng, và Số phòng.',
      });
    }

    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Khách sạn không tồn tại.' });
    }

    const roomType = await RoomType.findByPk(roomTypeId);
    if (!roomType) {
      return res.status(404).json({ success: false, message: 'Hạng phòng không tồn tại.' });
    }

    if (parseInt(roomType.hotelId, 10) !== parseInt(hotelId, 10)) {
      return res.status(400).json({
        success: false,
        message: 'Hạng phòng không thuộc khách sạn đã chọn.',
      });
    }

    const trimmedNumber = String(roomNumber).trim();
    const existing = await Room.findOne({
      where: { hotelId, roomNumber: trimmedNumber },
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Số phòng "${trimmedNumber}" đã tồn tại trong khách sạn này.`,
      });
    }

    const parsedFloor = floor !== undefined && floor !== null && floor !== '' ? parseInt(floor, 10) : 1;
    const allowedStatuses = ['available', 'occupied', 'reserved', 'cleaning', 'maintenance', 'inactive'];
    const validStatus = status && allowedStatuses.includes(status.toLowerCase()) ? status.toLowerCase() : 'available';

    const newRoom = await Room.create({
      hotelId: parseInt(hotelId, 10),
      roomTypeId: parseInt(roomTypeId, 10),
      roomNumber: trimmedNumber,
      floor: isNaN(parsedFloor) ? 1 : parsedFloor,
      status: validStatus,
    });

    const fullRoom = await Room.findByPk(newRoom.id, { include: [Hotel, RoomType] });
    return res.status(201).json({
      success: true,
      message: 'Tạo phòng mới thành công.',
      room: formatRoom(fullRoom),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng.' });

    const { hotelId, roomTypeId, roomNumber, floor, status } = req.body;

    const targetHotelId = hotelId ? parseInt(hotelId, 10) : room.hotelId;
    const targetRoomTypeId = roomTypeId ? parseInt(roomTypeId, 10) : room.roomTypeId;
    const targetRoomNumber = roomNumber ? String(roomNumber).trim() : room.roomNumber;

    if (roomTypeId || hotelId) {
      const roomType = await RoomType.findByPk(targetRoomTypeId);
      if (!roomType) {
        return res.status(404).json({ success: false, message: 'Hạng phòng không tồn tại.' });
      }
      if (parseInt(roomType.hotelId, 10) !== targetHotelId) {
        return res.status(400).json({
          success: false,
          message: 'Hạng phòng không thuộc khách sạn đã chọn.',
        });
      }
    }

    if (roomNumber || hotelId) {
      const existing = await Room.findOne({
        where: {
          hotelId: targetHotelId,
          roomNumber: targetRoomNumber,
          id: { [Op.ne]: room.id },
        },
      });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: `Số phòng "${targetRoomNumber}" đã tồn tại trong khách sạn này.`,
        });
      }
    }

    const allowedStatuses = ['available', 'occupied', 'reserved', 'cleaning', 'maintenance', 'inactive'];
    const updateData = {};
    if (hotelId) updateData.hotelId = targetHotelId;
    if (roomTypeId) updateData.roomTypeId = targetRoomTypeId;
    if (roomNumber) updateData.roomNumber = targetRoomNumber;
    if (floor !== undefined && floor !== null && floor !== '') {
      const p = parseInt(floor, 10);
      updateData.floor = isNaN(p) ? room.floor : p;
    }
    if (status && allowedStatuses.includes(status.toLowerCase())) {
      updateData.status = status.toLowerCase();
    }

    await room.update(updateData);
    const updatedRoom = await Room.findByPk(room.id, { include: [Hotel, RoomType] });
    return res.json({
      success: true,
      message: 'Cập nhật thông tin phòng thành công.',
      room: formatRoom(updatedRoom),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateRoomStatus = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng.' });

    const { status } = req.body;
    const allowedStatuses = ['available', 'occupied', 'reserved', 'cleaning', 'maintenance', 'inactive'];
    if (!status || !allowedStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ message: 'Trạng thái phòng không hợp lệ.' });
    }

    await room.update({ status: status.toLowerCase() });
    const updatedRoom = await Room.findByPk(room.id, { include: [Hotel, RoomType] });
    return res.json({ message: 'Cập nhật trạng thái phòng thành công.', room: formatRoom(updatedRoom) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng.' });

    const bookingCount = await Booking.count({ where: { roomId: room.id } });

    if (bookingCount > 0) {
      await room.update({ status: 'inactive' });
      const updatedRoom = await Room.findByPk(room.id, { include: [Hotel, RoomType] });
      return res.status(200).json({
        message: 'Phòng đã có lịch sử đặt phòng nên đã được chuyển sang trạng thái Ngừng hoạt động (Soft Delete).',
        isSoftDeleted: true,
        room: formatRoom(updatedRoom),
      });
    }

    await room.destroy();
    return res.status(200).json({ message: 'Xóa phòng thành công.', isSoftDeleted: false });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getRoomTypes = async (req, res) => {
  try {
    const roomTypes = await RoomType.findAll({ include: [Hotel] });
    return res.json({ roomTypes: roomTypes.map(formatRoomType) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createRoomType = async (req, res) => {
  try {
    const roomType = await RoomType.create(req.body);
    return res.status(201).json({ roomType: formatRoomType(roomType) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateRoomType = async (req, res) => {
  try {
    const roomType = await RoomType.findByPk(req.params.id);
    if (!roomType) return res.status(404).json({ message: 'Loại phòng không tồn tại.' });
    await roomType.update(req.body);
    return res.json({ roomType: formatRoomType(roomType) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteRoomType = async (req, res) => {
  try {
    const roomType = await RoomType.findByPk(req.params.id);
    if (!roomType) return res.status(404).json({ message: 'Loại phòng không tồn tại.' });
    await roomType.destroy();
    return res.json({ message: 'Xóa loại phòng thành công.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
