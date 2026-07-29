export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: 'Vui lòng đăng nhập trước khi thực hiện thao tác này.',
    });
  }

  const role = (req.user.role || '').toLowerCase();
  if (role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      message: 'Quyền truy cập bị từ chối. Chỉ dành cho Quản Trị Viên (Admin).',
    });
  }
};
