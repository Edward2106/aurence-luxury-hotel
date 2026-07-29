# Final Architecture & Directory Structure Guide

**Project**: Aurence Luxury Hotel Management System  
**Date**: 2026-07-30  

---

## 1. Directory Tree & Component Organization

```text
Luxury hotel/
├── backend/
│   ├── src/
│   │   ├── config/             # MySQL database connection pool & Sequelize instance
│   │   ├── constants/          # Shared status constants (BOOKING_STATUS, PAYMENT_STATUS)
│   │   ├── controllers/        # Thin HTTP request handlers for Auth, Hotels, Rooms, Bookings, Services, Reviews, Admin, Notifications
│   │   ├── middleware/         # JWT authentication & authorization middleware
│   │   ├── models/             # Sequelize models (User, Hotel, Room, Booking, Invoice, Service, Review, etc.)
│   │   ├── routes/             # Express API endpoint definitions mounted under /api
│   │   ├── utils/              # Utility functions & sendSuccess/sendError response helpers
│   │   └── server.js           # Server startup script listening on Port 5000
│   ├── .env                    # Active environment credentials
│   ├── .env.example            # Environment template file
│   └── package.json            # Node.js backend dependencies & scripts
├── frontend/
│   ├── public/
│   │   └── images/             # Static UI image assets (hotels, rooms, services, payment-qr-simulation.jpg)
│   ├── src/
│   │   ├── components/         # Reusable UI components (Header, Footer, BookingCard, HotelCard, Modal, NotificationDropdown, StatusBadge, etc.)
│   │   ├── constants/          # UI status label mappings & simulation notices
│   │   ├── context/            # React AuthContext state provider
│   │   ├── layouts/            # Layout wrappers (AdminLayout)
│   │   ├── pages/              # Customer & Admin views (HomePage, HotelsPage, BookingPage, InvoicePage, AdminDashboardPage, etc.)
│   │   ├── services/           # Domain API modules (authService, hotelService, bookingService, reviewService, etc.)
│   │   ├── App.jsx             # React Router configuration
│   │   ├── index.css           # Tailwind CSS directives
│   │   └── main.jsx            # Application entry point
│   ├── package.json            # React + Vite dependencies & scripts
│   └── vite.config.js          # Vite build configuration
├── test-results/               # Structured QA test reports, WebP video recording, & screenshots
├── CLEANUP_REPORT.md           # Safety audit cleanup report
├── REFACTOR_BASELINE.md        # Architectural baseline report
└── REFACTORING_REPORT.md       # Comprehensive refactoring report
```

---

## 2. Explanation of Core Modules

- **`backend/src/constants/statusConstants.js`**: Centralized enumeration of booking, payment, and user status strings preventing string typo bugs across the backend controllers.
- **`backend/src/utils/responseHelper.js`**: Uniform HTTP JSON response formatting helper functions (`sendSuccess`, `sendError`).
- **`frontend/src/constants/statusConstants.js`**: Vietnamese UI label mappings for statuses (e.g. `paid` -> `Đã mô phỏng thanh toán`, `unpaid` -> `Chưa thanh toán`).
- **`frontend/src/services/api.js`**: Centralized Axios client instance configured with authorization headers and error response interceptors.
