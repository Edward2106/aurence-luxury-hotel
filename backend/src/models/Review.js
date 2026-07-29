import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'user_id',
  },
  hotelId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'hotel_id',
  },
  bookingId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    unique: true,
    field: 'booking_id',
  },
  overallRating: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
    field: 'overall_rating',
  },
  roomRating: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: true,
    field: 'room_rating',
  },
  staffRating: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: true,
    field: 'staff_rating',
  },
  cleanlinessRating: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: true,
    field: 'cleanliness_rating',
  },
  foodRating: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: true,
    field: 'food_rating',
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'image_url',
  },
  status: {
    type: DataTypes.ENUM('visible', 'hidden'),
    allowNull: false,
    defaultValue: 'visible',
  },
}, {
  tableName: 'reviews',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
