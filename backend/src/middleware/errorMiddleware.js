export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const origin = req.headers && req.headers.origin;
  if (origin) {
    const cleanOrigin = origin.trim().replace(/\/+$/, '');
    res.setHeader('Access-Control-Allow-Origin', cleanOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
  }
  return res.status(statusCode).json({
    message: err.message || 'Lỗi Máy Chủ Nội Bộ',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
