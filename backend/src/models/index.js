import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { sequelize } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const models = {};

const files = fs.readdirSync(__dirname).filter(
  (file) => file !== 'index.js' && file.endsWith('.js')
);

for (const file of files) {
  const filePath = path.join(__dirname, file);
  const module = await import(pathToFileURL(filePath).href);
  Object.keys(module).forEach((modelName) => {
    models[modelName] = module[modelName];
  });
}

const {
  User,
  Hotel,
  RoomType,
  Room,
  Booking,
  Service,
  ServiceOrder,
  Invoice,
  Review,
  Employee,
  Setting,
  Notification,
} = models;

Hotel.hasMany(RoomType, { foreignKey: 'hotelId' });
RoomType.belongsTo(Hotel, { foreignKey: 'hotelId' });

Hotel.hasMany(Room, { foreignKey: 'hotelId' });
Room.belongsTo(Hotel, { foreignKey: 'hotelId' });

RoomType.hasMany(Room, { foreignKey: 'roomTypeId' });
Room.belongsTo(RoomType, { foreignKey: 'roomTypeId' });

User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Room.hasMany(Booking, { foreignKey: 'roomId' });
Booking.belongsTo(Room, { foreignKey: 'roomId' });

Booking.hasMany(ServiceOrder, { foreignKey: 'bookingId' });
ServiceOrder.belongsTo(Booking, { foreignKey: 'bookingId' });

Service.hasMany(ServiceOrder, { foreignKey: 'serviceId' });
ServiceOrder.belongsTo(Service, { foreignKey: 'serviceId' });

Booking.belongsToMany(Service, { through: ServiceOrder, foreignKey: 'bookingId', otherKey: 'serviceId' });
Service.belongsToMany(Booking, { through: ServiceOrder, foreignKey: 'serviceId', otherKey: 'bookingId' });

Booking.hasOne(Invoice, { foreignKey: 'bookingId' });
Invoice.belongsTo(Booking, { foreignKey: 'bookingId' });

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

Hotel.hasMany(Review, { foreignKey: 'hotelId' });
Review.belongsTo(Hotel, { foreignKey: 'hotelId' });

Booking.hasOne(Review, { foreignKey: 'bookingId' });
Review.belongsTo(Booking, { foreignKey: 'bookingId' });

Hotel.hasMany(Employee, { foreignKey: 'hotelId' });
Employee.belongsTo(Hotel, { foreignKey: 'hotelId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

export {
  sequelize,
  User,
  Hotel,
  RoomType,
  Room,
  Booking,
  Service,
  ServiceOrder,
  Invoice,
  Review,
  Employee,
  Setting,
  Notification,
};
