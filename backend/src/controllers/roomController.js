import { Room, RoomType, Hotel } from '../models/index.js';

export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      include: [Hotel, RoomType],
    });
    return res.json({ rooms });
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
    return res.json({ room });
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
    return res.json({ roomTypes });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createRoomType = async (req, res) => {
  try {
    const roomType = await RoomType.create(req.body);
    return res.status(201).json({ roomType });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateRoomType = async (req, res) => {
  try {
    const roomType = await RoomType.findByPk(req.params.id);
    if (!roomType) return res.status(404).json({ message: 'Loại phòng không tồn tại.' });
    await roomType.update(req.body);
    return res.json({ roomType });
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
