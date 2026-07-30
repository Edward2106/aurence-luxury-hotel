import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const RoomType = sequelize.define('RoomType', {
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
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  capacity: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 2,
  },
  area: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
  },
  basePrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'base_price',
  },
  amenities: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'image_url',
  },
}, {
  tableName: 'room_types',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
