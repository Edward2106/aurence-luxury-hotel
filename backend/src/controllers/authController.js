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
    const seedAccounts = [
      {
        email: 'admin@aurencehotel.com',
        password: 'Admin@123',
        fullName: 'System Administrator',
        role: 'admin',
        phone: '0900000000',
      },
      {
        email: 'user@aurencehotel.com',
        password: 'User@123',
        fullName: 'Standard Hotel Customer',
        role: 'customer',
        phone: '0900000099',
      },
      {
        email: 'admin@aurence.com',
        password: 'Admin@123',
        fullName: 'System Administrator',
        role: 'admin',
        phone: null,
      },
      {
        email: 'customer@aurence.com',
        password: 'Customer@123',
        fullName: 'Demo Customer',
        role: 'customer',
        phone: '0901234567',
      },
      {
        email: 'admin.test@luxuryhotel.local',
        password: 'Admin@Test123',
        fullName: 'Test Administrator',
        role: 'admin',
        phone: '0900000001',
      },
      {
        email: 'customer.test@luxuryhotel.local',
        password: 'Customer@Test123',
        fullName: 'Test Customer',
        role: 'customer',
        phone: '0900000003',
      },
    ];

    for (const acc of seedAccounts) {
      let user = await User.findOne({ where: { email: acc.email } });
      const hashedPassword = await bcrypt.hash(acc.password, 10);
      if (!user) {
        await User.create({
          fullName: acc.fullName,
          email: acc.email,
          phone: acc.phone,
          password: hashedPassword,
          role: acc.role,
          status: 'active',
        });
      } else {
        user.password = hashedPassword;
        user.status = 'active';
        user.role = acc.role;
        await user.save();
      }
    }
    console.log('✅ Initial admin and user accounts verified and synchronized.');
  } catch (error) {
    console.warn('⚠️ Demo accounts initialization notice:', error.message);
  }
};
