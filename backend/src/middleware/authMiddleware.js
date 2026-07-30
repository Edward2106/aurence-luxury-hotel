import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'luxury_hotel_secret';

export const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token || token === 'null' || token === 'undefined') {
    return res.status(401).json({
      success: false,
      message: 'Vui lòng đăng nhập để sử dụng dịch vụ.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Vui lòng đăng nhập để sử dụng dịch vụ.',
    });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền thực hiện thao tác này.',
    });
  }
};
