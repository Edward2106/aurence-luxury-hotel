export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CHECKED_IN: 'checked_in',
  CHECKED_OUT: 'checked_out',
  CANCELLED: 'cancelled',
};

export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  REFUNDED: 'refunded',
};

export const BOOKING_STATUS_LABELS = {
  [BOOKING_STATUS.PENDING]: 'Chờ xác nhận',
  [BOOKING_STATUS.CONFIRMED]: 'Đã xác nhận',
  [BOOKING_STATUS.CHECKED_IN]: 'Đã nhận phòng',
  [BOOKING_STATUS.CHECKED_OUT]: 'Đã trả phòng',
  [BOOKING_STATUS.CANCELLED]: 'Đã hủy',
};

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.UNPAID]: 'Chưa thanh toán',
  [PAYMENT_STATUS.PAID]: 'Đã mô phỏng thanh toán',
  [PAYMENT_STATUS.REFUNDED]: 'Đã hoàn tiền',
};

export const PAYMENT_SIMULATION_DISCLAIMERS = {
  TITLE: 'Mã QR Thanh Toán Mô Phỏng',
  DESCRIPTION: 'Quét mã để mô phỏng quy trình thanh toán. Hệ thống không thực hiện giao dịch ngân hàng thực tế.',
  NOTICE: 'Chức năng này chỉ cập nhật trạng thái hóa đơn trong cơ sở dữ liệu và phục vụ mục đích học tập, trình diễn.',
  MODAL_TITLE: 'Xác Nhận Thanh Toán Mô Phỏng',
  NOTIFICATION_TITLE: 'Mô Phỏng Thanh Toán Thành Công',
};
