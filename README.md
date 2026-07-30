# Aurence Luxury Hotel Management System

Website Quản Lý Khách Sạn Thượng Lưu **Aurence Luxury Hotel Management System** được phát triển nhằm mục đích học tập, nghiên cứu và trình diễn công nghệ full-stack thương mại điện tử / quản lý khách sạn chuyên nghiệp.

---

## Công Nghệ Sử Dụng

### Frontend
- **React 18**: Thư viện UI xây dựng giao diện người dùng theo component.
- **Vite 5**: Công cụ đóng gói và phát triển frontend tốc độ cao.
- **Tailwind CSS**: Framework CSS tiện ích giúp tùy chỉnh giao diện sang trọng, responsive.
- **Lucide React & Framer Motion**: Hệ thống icon và hiệu ứng chuyển động mượt mà.

### Backend
- **Node.js & Express**: Hợp nhất RESTful API server.
- **Sequelize ORM**: Quản lý truy vấn dữ liệu SQL type-safe và mô hình hóa quan hệ.
- **JSON Web Token (JWT) & bcrypt**: Xác thực người dùng và mã hóa mật khẩu an toàn.

### Cơ Sở Dữ Liệu
- **MySQL Server**: Lưu trữ cơ sở dữ liệu quan hệ với các bảng khách sạn, loại phòng, đặt phòng, hóa đơn, dịch vụ, thông báo, đánh giá.

---

## Chức Năng Khách Hàng (Customer Features)

1. **Đăng ký & Đăng nhập**: Khởi tạo tài khoản khách hàng, bảo mật JWT session.
2. **Xem & Tìm kiếm Khách sạn**: Tìm kiếm theo tên, thành phố, giá cả và tiện ích.
3. **Xem Chi Tiết Phòng**: Xem hình ảnh, diện tích, loại giường, sức chứa người lớn / trẻ em.
4. **Kiểm Tra Phòng Trống**: Lọc phòng theo ngày nhận phòng (check-in) và ngày trả phòng (check-out).
5. **Đặt Phòng Khách Sạn**: Tính toán tự động số đêm, tiền phòng, phí dịch vụ, thuế VAT và tổng tiền.
6. **Xem Lịch Sử Đặt Phòng**: Quản lý các đơn đặt phòng sắp tới, lịch sử lưu trú và chi tiết đơn đặt.
7. **Hủy Đặt Phòng**: Hủy đơn đặt phòng hợp lệ và cập nhật trạng thái tự động.
8. **Đặt Dịch Vụ Đi Kèm**: Đặt các dịch vụ cao cấp như đưa đón sân bay, spa, ăn uống.
9. **Xem Hóa Đơn**: Tra cứu chi tiết hóa đơn, tiền phòng, phí dịch vụ và tiền thuế.
10. **Thanh Toán QR Mô Phỏng**: Trải nghiệm giao diện mô phỏng thanh toán quét mã QR.
11. **Hệ Thống Thông Báo**: Nhận thông báo thời gian thực về đặt phòng, thanh toán, đổi trạng thái.
12. **Quản Lý Hồ Sơ Cá Nhân**: Cập nhật thông tin tài khoản và đổi mật khẩu.
13. **Đánh Giá Khách Sạn**: Gửi đánh giá và chấm điểm sao cho trải nghiệm lưu trú.

---

## Chức Năng Quản Trị (Admin Features)

1. **Tổng Quan (Dashboard)**: Thống kê doanh thu mô phỏng, tổng đơn đặt, tỷ lệ lấp đầy phòng.
2. **Quản Lý Khách Sạn & Loại Phòng**: Thêm, sửa, cập nhật danh mục khách sạn và phòng.
3. **Quản Lý Đặt Phòng**: Cập nhật trạng thái đặt phòng (`confirmed`, `checked_in`, `checked_out`, `cancelled`).
4. **Quản Lý Khách Hàng & Nhân Viên**: Theo dõi danh sách tài khoản và phân quyền người dùng.
5. **Quản Lý Đánh Giá**: Kiểm duyệt và phản hồi đánh giá từ khách hàng.
6. **Báo Cáo & Cài Đặt**: Cấu hình thông số hệ thống.

---

## Thanh Toán Mô Phỏng (Simulated Payment Disclaimer)

> **LƯU Ý QUAN TRỌNG**: Hệ thống mô phỏng quy trình thanh toán. Khi người dùng xác nhận, hệ thống cập nhật trạng thái đặt phòng và hóa đơn trong MySQL, đồng thời gửi thông báo cho khách hàng và quản trị viên. Hệ thống không thực hiện giao dịch ngân hàng thực tế và chưa tích hợp cổng thanh toán VNPAY.

---

## Cấu Trúc Dự Án

Chi tiết cấu trúc cây thư mục và giải thích các module được ghi nhận trong file:  
📄 [FINAL_PROJECT_STRUCTURE.md](FINAL_PROJECT_STRUCTURE.md)

---

## Yêu Cầu Cài Đặt (Prerequisites)

- **Node.js**: v18.0.0 trở lên
- **npm**: v9.0.0 trở lên
- **MySQL Server**: v8.0 / MySQL 26.7 (chạy trên port `3306`)

---

## Hướng Dẫn Cài Đặt & Khởi Chạy (Setup Instructions)

### 1. Cấu hình biến môi trường (Environment Variables)

Sao chép file mẫu và điền thông tin cấu hình tương ứng:

```bash
# Backend configuration
cp backend/.env.example backend/.env

# Frontend configuration
cp frontend/.env.example frontend/.env
```

### 2. Khởi tạo Cơ sở Dữ liệu (Database Setup)

Import file cơ sở dữ liệu MySQL đã chuẩn bị sẵn vào Server MySQL local:
- File SQL chính: `C:\Users\ngock\Documents\SQL Server Management Studio 22\luxury_hotel_final.sql`

### 3. Cài đặt Dependencies và Chạy Backend

```bash
cd backend
npm install
npm run dev
```
Backend sẽ khởi chạy tại: `http://localhost:5000`

### 4. Cài đặt Dependencies và Chạy Frontend

Open terminal mới:

```bash
cd frontend
npm install
npm run dev
```
Frontend sẽ khởi chạy tại: `http://127.0.0.1:5173`

---

## Tài Khoản Thử Nghiệm (Demo Accounts)

- **Tài khoản Khách hàng (Customer)**:
  - Email: `user@aurencehotel.com`
  - Password: `User@123`

- **Tài khoản Quản trị viên (Admin)**:
  - Email: `admin@aurencehotel.com`
  - Password: `Admin@123`
---

## Lưu Ý Bảo Mật (Security Best Practices)

- Không bao giờ commit file `.env` lên GitHub hoặc kho lưu trữ công khai.
- Thay đổi `JWT_SECRET` và mật khẩu MySQL `DB_PASSWORD` khi triển khai thực tế.
- Không nhập thông tin thẻ ngân hàng thật hay tài khoản thanh toán thật vào giao diện thử nghiệm.

---

## Tác Giả (Author)

- **Họ và tên**: Nguyễn Ngọc Kỳ
- **MSSV**: 24DH112710
- **Ngành**: Khoa học dữ liệu
- **Trường**: Đại học Ngoại ngữ - Tin học TP.HCM (HUFLIT)
