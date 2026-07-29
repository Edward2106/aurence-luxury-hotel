import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const JWT_SECRET = process.env.JWT_SECRET || 'luxury_hotel_secret';

export const register = async (req, res) => {
  try {
    const { fullName, name, email, phone, password } = req.body;
    const userFullName = (fullName || name || '').trim();
    const userEmail = (email || '').trim().toLowerCase();

    if (!userFullName || !userEmail || !password) {
      return res.status(400).json({
        message: 'Vui lòng cung cấp đầy đủ các thông tin bắt buộc: Họ tên, email và mật khẩu.',
      });
    }

    if (!EMAIL_REGEX.test(userEmail)) {
      return res.status(400).json({
        message: 'Địa chỉ email không đúng định dạng hợp lệ.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Mật khẩu phải có độ dài ít nhất 6 ký tự.',
      });
    }

    const existingUser = await User.findOne({ where: { email: userEmail } });
    if (existingUser) {
      return res.status(400).json({
        message: 'Địa chỉ email này đã được sử dụng trong hệ thống.',
      });
    }

    if (phone && phone.trim()) {
      const existingPhone = await User.findOne({ where: { phone: phone.trim() } });
      if (existingPhone) {
        return res.status(400).json({
          message: 'Số điện thoại này đã được sử dụng trong hệ thống.',
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName: userFullName,
      email: userEmail,
      phone: phone || null,
      password: hashedPassword,
      role: 'customer',
      status: 'active',
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        role: newUser.role,
        email: newUser.email,
        fullName: newUser.fullName,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Tạo tài khoản thành công.',
      token,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        name: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        status: newUser.status,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Lỗi hệ thống khi đăng ký tài khoản.',
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userEmail = (email || '').trim().toLowerCase();

    if (!userEmail || !password) {
      return res.status(400).json({
        message: 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.',
      });
    }

    if (!EMAIL_REGEX.test(userEmail)) {
      return res.status(400).json({
        message: 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.',
      });
    }

    const user = await User.findOne({ where: { email: userEmail } });
    if (!user) {
      return res.status(401).json({
        message: 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.',
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        message: 'Tài khoản của bạn đã bị khóa hoặc chưa kích hoạt.',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
        fullName: user.fullName,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Đăng nhập thành công.',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Lỗi hệ thống khi đăng nhập.',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: 'Không tìm thấy thông tin tài khoản người dùng.',
      });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        fullName: user.fullName,
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Lỗi hệ thống khi lấy thông tin cá nhân.',
    });
  }
};

export const logout = async (req, res) => {
  return res.status(200).json({
    message: 'Đăng xuất tài khoản thành công.',
  });
};

export const seedInitialAdmin = async () => {
  try {
    const adminEmail = 'admin@aurence.com';
    let admin = await User.findOne({ where: { email: adminEmail } });
    const hashedAdminPassword = await bcrypt.hash('Admin@123', 10);
    if (!admin) {
      admin = await User.create({
        fullName: 'System Administrator',
        email: adminEmail,
        password: hashedAdminPassword,
        role: 'admin',
        status: 'active',
      });
    } else {
      admin.password = hashedAdminPassword;
      admin.status = 'active';
      await admin.save();
    }

    const customerEmail = 'customer@aurence.com';
    let customer = await User.findOne({ where: { email: customerEmail } });
    const hashedCustomerPassword = await bcrypt.hash('Customer@123', 10);
    if (!customer) {
      customer = await User.create({
        fullName: 'Demo Customer',
        email: customerEmail,
        phone: '0901234567',
        password: hashedCustomerPassword,
        role: 'customer',
        status: 'active',
      });
    } else {
      customer.password = hashedCustomerPassword;
      customer.status = 'active';
      await customer.save();
    }
  } catch (error) {
    console.warn('⚠️ Demo accounts initialization notice:', error.message);
  }
};
