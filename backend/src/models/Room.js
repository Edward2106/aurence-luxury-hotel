import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  hotelId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'hotel_id',
  },
  roomTypeId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'room_type_id',
  },
  roomNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'room_number',
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('available', 'occupied', 'reserved', 'cleaning', 'maintenance'),
    allowNull: false,
    defaultValue: 'available',
  },
}, {
  tableName: 'rooms',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
