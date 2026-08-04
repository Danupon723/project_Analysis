-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 04, 2026 at 02:19 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `badminton_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `booking_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `duration` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `total_price` decimal(10,2) NOT NULL,
  `paid_amount` decimal(10,2) DEFAULT 0.00,
  `payment_status` enum('pending','partial','paid') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `booking_date`, `start_time`, `end_time`, `duration`, `quantity`, `total_price`, `paid_amount`, `payment_status`, `created_at`) VALUES
(1, '2026-03-03', '16:00:00', '18:00:00', 2, 10, 400.00, 400.00, 'paid', '2026-04-05 10:35:12'),
(2, '2026-03-03', '15:00:00', '18:00:00', 3, 6, 600.00, 600.00, 'pending', '2026-04-05 14:06:39'),
(4, '2026-03-30', '17:00:00', '19:00:00', 2, 4, 400.00, 400.00, 'pending', '2026-04-05 16:29:11'),
(5, '2026-03-30', '15:00:00', '16:00:00', 1, 3, 200.00, 200.00, 'partial', '2026-04-05 16:36:43'),
(7, '2026-04-05', '15:00:00', '18:00:00', 3, 2, 600.00, 600.00, 'paid', '2026-04-05 16:52:14'),
(8, '2026-04-05', '09:00:00', '11:00:00', 2, 1, 200.00, 200.00, 'paid', '2026-04-05 17:01:58'),
(9, '2026-04-09', '10:00:00', '13:00:00', 3, 1, 300.00, 300.00, 'paid', '2026-04-05 17:16:30'),
(10, '2026-04-05', '18:00:00', '21:00:00', 3, 1, 450.00, 450.00, 'paid', '2026-04-05 17:17:19'),
(11, '2026-04-06', '14:00:00', '16:00:00', 2, 1, 200.00, 200.00, 'paid', '2026-04-05 17:18:58'),
(12, '2026-04-07', '09:00:00', '12:00:00', 3, 2, 600.00, 600.00, 'paid', '2026-04-05 17:23:11'),
(13, '2026-04-08', '09:00:00', '11:00:00', 2, 1, 200.00, 200.00, 'paid', '2026-04-05 17:43:00'),
(14, '2026-04-08', '13:00:00', '17:00:00', 4, 1, 400.00, 0.00, 'pending', '2026-04-06 09:07:12'),
(15, '2026-04-10', '10:00:00', '13:00:00', 3, 1, 300.00, 300.00, 'paid', '2026-04-10 10:36:28'),
(16, '2026-04-09', '15:00:00', '19:00:00', 4, 1, 400.00, 400.00, 'paid', '2026-04-10 10:44:10'),
(17, '2026-05-21', '22:00:00', '23:00:00', 1, 1, 200.00, 200.00, 'paid', '2026-05-19 14:29:52'),
(18, '2026-06-16', '10:00:00', '13:00:00', 3, 1, 300.00, 300.00, 'paid', '2026-06-11 17:05:11');

-- --------------------------------------------------------

--
-- Table structure for table `courts`
--

CREATE TABLE `courts` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` int(11) NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `status` enum('active','inactive','finished') DEFAULT 'active',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courts`
--

INSERT INTO `courts` (`id`, `name`, `price`, `start_time`, `end_time`, `status`, `created_at`, `updated_at`) VALUES
(1, 'couts1', 200, '00:00:00', '12:00:00', 'inactive', '2026-04-13 19:56:09', '2026-04-13 20:06:02'),
(2, 'สนามแบดมินตัน A', 300, '00:00:00', '12:00:00', 'inactive', '2026-04-13 19:56:09', '2026-04-13 20:06:12'),
(3, 'สนามแบดมินตัน B', 300, '00:00:00', '00:00:00', 'active', '2026-04-13 19:56:09', NULL),
(4, 'สนามแบดมินตัน C', 350, '00:00:00', '00:00:00', 'active', '2026-04-13 19:56:09', NULL),
(5, 'สนามแบดมินตัน VIP', 500, '00:00:00', '00:00:00', 'active', '2026-04-13 19:56:09', NULL),
(6, 'สนามฝึกซ้อม', 200, '00:00:00', '00:00:00', '', '2026-04-13 19:56:09', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` int(15) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `phone`, `password`, `role`, `created_at`, `name`) VALUES
(2, 'mnisinghweiyr@gmail.com', NULL, '235641Id', 'user', '2026-03-27 17:18:44', '10'),
(5, 'admin@gmail.com', NULL, '$2b$10$P0uAFXkl5W8y1.J5FX3SbeAMMV5UhNNBwhoJ5ot17tyGm3/O2NfSG', 'admin', '2026-03-29 07:54:23', 'admin_vier'),
(7, 'admin_1@gmail.com', NULL, '$2b$10$kMgPPw3mrQMeU9sYSXtE8eNdDPJqrEnmrx0ZTVgiXEkFXMvoFrjAe', 'admin', '2026-04-05 12:48:50', 'Admin assistant'),
(8, 'user@gmail.com', NULL, '$2b$10$DJ7xP.j6Jcl.vXpZWjyim.JpT/muxEzHcljY05GrpNoHM8n2us4gW', 'user', '2026-04-13 13:11:31', 'demo_user'),
(9, 'victor@gmail.com', NULL, '$2b$10$bJRbh0lltPBJozGsyTLTl.RZ3CC9Gg/hJWMdS0jCRbU50YMKPhcNm', 'user', '2026-04-13 13:15:14', 'victor'),
(10, 'kim@gmail.com', NULL, '$2b$10$3LjBO0Lo7sUplbGVAPVNd.gnN3xSIkl8yQrInlHatuRt6zJ4gIy2i', 'user', '2026-04-13 13:18:01', 'kimwonho'),
(11, 'chiharu@gmail.com', NULL, '$2b$10$0AQ0jCUAbFbY9Jsn.oGWleiCJuB4nJGVSyA6vJech3MrOMtM3ifou', 'user', '2026-04-13 13:24:25', 'chiharu'),
(12, 'jonatan@gmail.com', 884567890, '$2b$10$pG17O4inlpxktsXy1wMMZ.3umwEqrdc.jjAMA8ZUlC5taNbiEp0Bm', 'user', '2026-04-14 11:25:27', 'jonatan '),
(13, 'new@gmail.com', 649590032, '$2b$10$2yQJt7QXhXl.12hXT2R9KuVc1yqsmCYUj6y01tNV0YFEqWTBYlTei', 'user', '2026-04-15 09:21:31', 'new'),
(14, 'vierdanupon@gmail.com', 635920439, '$2b$10$GmKVydBMbZIfKPVGlJRhVeatAVbf4N0Sk8ZgcqtQBSiUqZIDC94QG', 'user', '2026-05-19 14:27:44', 'Admin_Vier');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `courts`
--
ALTER TABLE `courts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `courts`
--
ALTER TABLE `courts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
