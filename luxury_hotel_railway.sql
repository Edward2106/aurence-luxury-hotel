-- Aurence Luxury Hotel Database Dump for Railway MySQL Deployment
-- Compatible with Railway, PlanetScale, Render, and Managed MySQL Cloud Services
-- Generated on 2026-07-30

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- Note: Database creation and USE statements are commented out to allow importing into Railway's assigned database.
-- CREATE DATABASE IF NOT EXISTS luxury_hotel DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE luxury_hotel;

-- ==================================================
-- 1. USERS TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','receptionist','customer') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'customer',
  `status` enum('active','inactive','locked') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `avatar_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_login_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  UNIQUE KEY `uq_users_phone` (`phone`),
  KEY `idx_users_role_status` (`role`,`status`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 2. HOTELS TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS `hotels` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'việt nam',
  `description` text COLLATE utf8mb4_unicode_ci,
  `star_rating` tinyint unsigned NOT NULL DEFAULT '5',
  `average_rating` decimal(3,2) NOT NULL DEFAULT '0.00',
  `review_count` int unsigned NOT NULL DEFAULT '0',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `check_in_time` time NOT NULL DEFAULT '14:00:00',
  `check_out_time` time NOT NULL DEFAULT '12:00:00',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_hotels_slug` (`slug`),
  KEY `idx_hotels_city_status` (`city`,`status`),
  KEY `idx_hotels_name` (`name`),
  CONSTRAINT `chk_hotels_average_rating` CHECK ((`average_rating` between 0 and 5)),
  CONSTRAINT `chk_hotels_review_count` CHECK ((`review_count` >= 0)),
  CONSTRAINT `chk_hotels_star_rating` CHECK ((`star_rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 3. ROOM TYPES TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS `room_types` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `hotel_id` int unsigned NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(130) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `capacity` int unsigned NOT NULL DEFAULT '2',
  `max_adults` int unsigned NOT NULL DEFAULT '2',
  `max_children` int unsigned NOT NULL DEFAULT '0',
  `bed_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area` decimal(8,2) DEFAULT NULL,
  `base_price` decimal(15,2) NOT NULL,
  `amenities` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_room_types_hotel_slug` (`hotel_id`,`slug`),
  KEY `idx_room_types_hotel_status` (`hotel_id`,`status`),
  CONSTRAINT `fk_room_types_hotel` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_room_types_area` CHECK (((`area` is null) or (`area` > 0))),
  CONSTRAINT `chk_room_types_base_price` CHECK ((`base_price` >= 0)),
  CONSTRAINT `chk_room_types_capacity` CHECK ((`capacity` > 0)),
  CONSTRAINT `chk_room_types_max_adults` CHECK ((`max_adults` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 4. ROOMS TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS `rooms` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `hotel_id` int unsigned NOT NULL,
  `room_type_id` int unsigned NOT NULL,
  `room_number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `floor` int DEFAULT NULL,
  `status` enum('available','occupied','reserved','cleaning','maintenance') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_rooms_hotel_number` (`hotel_id`,`room_number`),
  KEY `idx_rooms_hotel_status` (`hotel_id`,`status`),
  KEY `idx_rooms_room_type_status` (`room_type_id`,`status`),
  CONSTRAINT `fk_rooms_hotel` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_rooms_room_type` FOREIGN KEY (`room_type_id`) REFERENCES `room_types` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `chk_rooms_floor` CHECK (((`floor` is null) or (`floor` >= 0)))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 5. BOOKINGS TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `booking_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int unsigned NOT NULL,
  `room_id` int unsigned NOT NULL,
  `check_in_date` date NOT NULL,
  `check_out_date` date NOT NULL,
  `guest_count` int unsigned NOT NULL DEFAULT '1',
  `adult_count` int unsigned NOT NULL DEFAULT '1',
  `child_count` int unsigned NOT NULL DEFAULT '0',
  `number_of_nights` int unsigned NOT NULL DEFAULT '1',
  `room_price` decimal(15,2) NOT NULL,
  `room_charge` decimal(15,2) NOT NULL DEFAULT '0.00',
  `service_charge` decimal(15,2) NOT NULL DEFAULT '0.00',
  `vat_rate` decimal(5,2) NOT NULL DEFAULT '10.00',
  `vat_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `total_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `status` enum('pending','confirmed','checked_in','checked_out','completed','cancelled','no_show') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `payment_status` enum('unpaid','partially_paid','paid','refunded') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unpaid',
  `special_request` text COLLATE utf8mb4_unicode_ci,
  `cancellation_reason` text COLLATE utf8mb4_unicode_ci,
  `confirmed_at` datetime DEFAULT NULL,
  `checked_in_at` datetime DEFAULT NULL,
  `checked_out_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `cancelled_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_bookings_code` (`booking_code`),
  KEY `idx_bookings_user` (`user_id`),
  KEY `idx_bookings_room_dates` (`room_id`,`check_in_date`,`check_out_date`),
  KEY `idx_bookings_status` (`status`),
  KEY `idx_bookings_payment_status` (`payment_status`),
  KEY `idx_bookings_check_in_date` (`check_in_date`),
  CONSTRAINT `fk_bookings_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_bookings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `chk_bookings_adult_count` CHECK ((`adult_count` > 0)),
  CONSTRAINT `chk_bookings_amounts` CHECK (((`room_charge` >= 0) and (`service_charge` >= 0) and (`vat_rate` >= 0) and (`vat_amount` >= 0) and (`discount_amount` >= 0) and (`total_amount` >= 0))),
  CONSTRAINT `chk_bookings_child_count` CHECK ((`child_count` >= 0)),
  CONSTRAINT `chk_bookings_dates` CHECK ((`check_out_date` > `check_in_date`)),
  CONSTRAINT `chk_bookings_guest_count` CHECK ((`guest_count` > 0)),
  CONSTRAINT `chk_bookings_number_of_nights` CHECK ((`number_of_nights` > 0)),
  CONSTRAINT `chk_bookings_room_price` CHECK ((`room_price` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 6. INVOICES TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `invoice_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `booking_id` int unsigned NOT NULL,
  `room_charge` decimal(15,2) NOT NULL DEFAULT '0.00',
  `service_charge` decimal(15,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `vat_rate` decimal(5,2) NOT NULL DEFAULT '10.00',
  `vat_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `total_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `amount_paid` decimal(15,2) NOT NULL DEFAULT '0.00',
  `amount_due` decimal(15,2) NOT NULL DEFAULT '0.00',
  `payment_method` enum('cash','bank_transfer','credit_card','debit_card','e_wallet') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` enum('unpaid','partially_paid','paid','refunded') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unpaid',
  `issued_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `paid_at` datetime DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_invoices_code` (`invoice_code`),
  UNIQUE KEY `uq_invoices_booking` (`booking_id`),
  KEY `idx_invoices_payment_status` (`payment_status`),
  CONSTRAINT `fk_invoices_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_invoices_amounts` CHECK (((`room_charge` >= 0) and (`service_charge` >= 0) and (`discount_amount` >= 0) and (`vat_rate` >= 0) and (`vat_amount` >= 0) and (`total_amount` >= 0) and (`amount_paid` >= 0) and (`amount_due` >= 0)))
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 7. SERVICES TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS `services` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `hotel_id` int unsigned NOT NULL,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(15,2) NOT NULL,
  `category` enum('spa','restaurant','airport_pickup','laundry','gym','wifi','butler','room_service','transportation','other') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'other',
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'lần',
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_services_hotel_status` (`hotel_id`,`status`),
  CONSTRAINT `fk_services_hotel` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_services_price` CHECK ((`price` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 8. SERVICE ORDERS TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS `service_orders` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `booking_id` int unsigned NOT NULL,
  `service_id` int unsigned NOT NULL,
  `quantity` int unsigned NOT NULL DEFAULT '1',
  `unit_price` decimal(15,2) NOT NULL,
  `total_price` decimal(15,2) NOT NULL,
  `status` enum('pending','confirmed','in_progress','completed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `ordered_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `confirmed_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `cancelled_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_service_orders_service` (`service_id`),
  KEY `idx_service_orders_booking` (`booking_id`),
  KEY `idx_service_orders_status` (`status`),
  CONSTRAINT `fk_service_orders_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_service_orders_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `chk_service_orders_quantity` CHECK ((`quantity` > 0)),
  CONSTRAINT `chk_service_orders_total_price` CHECK ((`total_price` >= 0)),
  CONSTRAINT `chk_service_orders_unit_price` CHECK ((`unit_price` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 9. REVIEWS TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `hotel_id` int unsigned NOT NULL,
  `booking_id` int unsigned NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `overall_rating` tinyint unsigned NOT NULL,
  `room_rating` tinyint unsigned DEFAULT NULL,
  `staff_rating` tinyint unsigned DEFAULT NULL,
  `cleanliness_rating` tinyint unsigned DEFAULT NULL,
  `service_rating` tinyint unsigned DEFAULT NULL,
  `location_rating` tinyint unsigned DEFAULT NULL,
  `value_rating` tinyint unsigned DEFAULT NULL,
  `food_rating` tinyint unsigned DEFAULT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','visible','hidden') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'visible',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_reviews_booking` (`booking_id`),
  KEY `idx_reviews_hotel_status` (`hotel_id`,`status`),
  KEY `idx_reviews_user` (`user_id`),
  CONSTRAINT `fk_reviews_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reviews_hotel` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_reviews_cleanliness_rating` CHECK (((`cleanliness_rating` is null) or (`cleanliness_rating` between 1 and 5))),
  CONSTRAINT `chk_reviews_food_rating` CHECK (((`food_rating` is null) or (`food_rating` between 1 and 5))),
  CONSTRAINT `chk_reviews_location_rating` CHECK (((`location_rating` is null) or (`location_rating` between 1 and 5))),
  CONSTRAINT `chk_reviews_overall_rating` CHECK ((`overall_rating` between 1 and 5)),
  CONSTRAINT `chk_reviews_room_rating` CHECK (((`room_rating` is null) or (`room_rating` between 1 and 5))),
  CONSTRAINT `chk_reviews_service_rating` CHECK (((`service_rating` is null) or (`service_rating` between 1 and 5))),
  CONSTRAINT `chk_reviews_staff_rating` CHECK (((`staff_rating` is null) or (`staff_rating` between 1 and 5))),
  CONSTRAINT `chk_reviews_value_rating` CHECK (((`value_rating` is null) or (`value_rating` between 1 and 5)))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 10. EMPLOYEES TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS `employees` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned DEFAULT NULL,
  `hotel_id` int unsigned NOT NULL,
  `employee_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` enum('manager','receptionist','housekeeping','service_staff','accountant') COLLATE utf8mb4_unicode_ci NOT NULL,
  `shift` enum('morning','afternoon','night','flexible') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'flexible',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `hired_at` date DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_employees_code` (`employee_code`),
  UNIQUE KEY `uq_employees_user` (`user_id`),
  UNIQUE KEY `uq_employees_email` (`email`),
  KEY `idx_employees_hotel_status` (`hotel_id`,`status`),
  CONSTRAINT `fk_employees_hotel` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_employees_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 11. SETTINGS TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS `settings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `value_type` enum('string','number','boolean','json','time') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'string',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_settings_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==================================================
-- 12. NOTIFICATIONS TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `role_target` varchar(50) DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `related_entity_type` varchar(50) DEFAULT NULL,
  `related_entity_id` int DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_role` (`role_target`),
  KEY `idx_read` (`is_read`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;
