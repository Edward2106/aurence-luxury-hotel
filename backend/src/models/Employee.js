import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Employee = sequelize.define('Employee', {
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
  fullName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'full_name',
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: true,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  position: {
    type: DataTypes.ENUM('manager', 'receptionist', 'housekeeping', 'service_staff'),
    allowNull: false,
  },
  shift: {
    type: DataTypes.ENUM('morning', 'afternoon', 'night', 'flexible'),
    allowNull: false,
    defaultValue: 'flexible',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active',
  },
  hiredAt: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'hired_at',
  },
}, {
  tableName: 'employees',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
