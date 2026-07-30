import { Room, RoomType, Hotel } from '../models/index.js';

const formatRoomType = (rtInstance) => {
  const plain = rtInstance.toJSON();
  const rawPrice = Number(plain.basePrice || plain.price || plain.pricePerNight);
  const price = Number.isFinite(rawPrice) && rawPrice >= 0 ? rawPrice : null;
  return {
    ...plain,
    basePrice: price,
    pricePerNight: price,
    price: price,
  };
};

export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      include: [Hotel, RoomType],
    });
    const formattedRooms = rooms.map((r) => {
      const plain = r.toJSON();
      if (plain.RoomType) {
        plain.RoomType = formatRoomType(r.RoomType);
      }
      return plain;
    });
    return res.json({ rooms: formattedRooms });
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
    const plain = room.toJSON();
    if (plain.RoomType) {
      plain.RoomType = formatRoomType(room.RoomType);
    }
    return res.json({ room: plain });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    return res.status(201).json({ room });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng.' });
    await room.update(req.body);
    return res.json({ room });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng.' });
    await room.destroy();
    return res.json({ message: 'Xóa phòng thành công.' });
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
