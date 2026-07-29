import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  bookingCode: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
    field: 'booking_code',
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'user_id',
  },
  roomId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'room_id',
  },
  checkInDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'check_in_date',
  },
  checkOutDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'check_out_date',
  },
  guestCount: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 1,
    field: 'guest_count',
  },
  roomPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'room_price',
  },
  totalAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'total_amount',
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
  },
  paymentStatus: {
    type: DataTypes.ENUM('unpaid', 'paid', 'refunded'),
    allowNull: false,
    defaultValue: 'unpaid',
    field: 'payment_status',
  },
  specialRequest: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'special_request',
  },
  checkedInAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'checked_in_at',
  },
  checkedOutAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'checked_out_at',
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'cancelled_at',
  },
}, {
  tableName: 'bookings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
