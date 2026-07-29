import { Notification } from '../models/index.js';
import { Op } from 'sequelize';

export const createNotificationHelper = async ({
  userId = null,
  roleTarget = null,
  type,
  title,
  message,
  relatedEntityType = null,
  relatedEntityId = null,
}) => {
  try {
    return await Notification.create({
      userId,
      roleTarget,
      type,
      title,
      message,
      relatedEntityType,
      relatedEntityId,
      isRead: false,
    });
  } catch (err) {
    console.error('Error creating notification:', err.message);
    return null;
  }
};

export const getMyNotifications = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;

    const whereConditions = [];
    if (userId) {
      whereConditions.push({ userId });
    }
    if (userRole === 'admin') {
      whereConditions.push({ roleTarget: 'admin' });
    }

    const notifications = await Notification.findAll({
      where: {
        [Op.or]: whereConditions,
      },
      order: [['created_at', 'DESC']],
      limit: 50,
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return res.json({ notifications, unreadCount });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Thông báo không tồn tại.' });
    }
    await notification.update({ isRead: true });
    return res.json({ message: 'Đã đánh dấu đã đọc.', notification });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;

    const whereConditions = [{ userId }];
    if (userRole === 'admin') {
      whereConditions.push({ roleTarget: 'admin' });
    }

    await Notification.update(
      { isRead: true },
      {
        where: {
          [Op.or]: whereConditions,
        },
      }
    );

    return res.json({ message: 'Tất cả thông báo đã được đánh dấu đã đọc.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
