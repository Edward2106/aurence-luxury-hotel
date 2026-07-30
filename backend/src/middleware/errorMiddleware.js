export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({
    message: err.message || 'Lỗi Máy Chủ Nội Bộ',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
