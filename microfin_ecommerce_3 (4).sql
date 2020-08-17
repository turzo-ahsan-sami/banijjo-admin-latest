-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 17, 2020 at 05:03 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `microfin_ecommerce_3`
--

DELIMITER $$
--
-- Functions
--
CREATE DEFINER=`root`@`localhost` FUNCTION `slugify` (`dirty_string` VARCHAR(200), `id` INT) RETURNS VARCHAR(200) CHARSET latin1 BEGIN
    DECLARE x, y , z Int;
    Declare temp_string, new_string VarChar(200);
    Declare is_allowed Bool;
    Declare c, check_char VarChar(1);

    set temp_string = LOWER(dirty_string);

    Set temp_string = replace(temp_string, '&', ' and ');

    Select temp_string Regexp('[^a-z0-9-]+') into x;
    If x = 1 then
        set z = 1;
        While z <= Char_length(temp_string) Do
            Set c = Substring(temp_string, z, 1);
            Set is_allowed = False;
            If !((ascii(c) = 45) or (ascii(c) >= 48 and ascii(c) <= 57) or (ascii(c) >= 97 and ascii(c) <= 122)) Then
                Set temp_string = Replace(temp_string, c, '-');
            End If;
            set z = z + 1;
        End While;
    End If;

    Select temp_string Regexp("^-|-$|'") into x;
    If x = 1 Then
        Set temp_string = Replace(temp_string, "'", '');
        Set z = Char_length(temp_string);
        Set y = Char_length(temp_string);
        Dash_check: While z > 1 Do
            If Strcmp(SubString(temp_string, -1, 1), '-') = 0 Then
                Set temp_string = Substring(temp_string,1, y-1);
                Set y = y - 1;
            Else
                Leave Dash_check;
            End If;
            Set z = z - 1;
        End While;
    End If;

    Repeat
        Select temp_string Regexp("--") into x;
        If x = 1 Then
            Set temp_string = Replace(temp_string, "--", "-");
        End If;
    Until x <> 1 End Repeat;

    If LOCATE('-', temp_string) = 1 Then
        Set temp_string = SUBSTRING(temp_string, 2);
    End If;
	
    Set temp_string = CONCAT(temp_string,'-',id);
    Return temp_string;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `advertisement`
--

CREATE TABLE `advertisement` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `url` text NOT NULL,
  `softDel` tinyint(2) NOT NULL,
  `status` tinyint(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `advertisement`
--

INSERT INTO `advertisement` (`id`, `name`, `image`, `description`, `url`, `softDel`, `status`) VALUES
(1, 'advertisement 1', 'asche.jpg', 'asdas', 'adsads', 0, 1),
(2, 'Test', 'check.png', 'sfdsfs', 'sdfds', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `areas`
--

CREATE TABLE `areas` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `city_id` int(11) DEFAULT NULL,
  `soft_del` enum('0','1') DEFAULT '0',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `areas`
--

INSERT INTO `areas` (`id`, `name`, `city_id`, `soft_del`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Paltan', 8, '0', 'active', '2020-05-11 08:37:12', '2020-05-11 08:37:12'),
(2, 'Motijheel', 8, '0', 'active', '2020-05-11 08:37:12', '2020-05-11 08:37:12'),
(3, 'Jatrabari', 8, '0', 'active', '2020-05-11 08:37:12', '2020-05-11 08:37:12'),
(4, 'Gulshan', 9, '0', 'active', '2020-05-11 08:37:12', '2020-05-11 08:37:12'),
(5, 'Banani', 9, '0', 'active', '2020-05-11 08:37:12', '2020-05-11 08:37:12'),
(6, 'Rampura', 9, '0', 'active', '2020-05-11 08:37:12', '2020-05-11 08:37:12'),
(7, 'Adabor', 9, '0', 'active', '2020-05-11 08:37:12', '2020-05-11 08:37:12');

-- --------------------------------------------------------

--
-- Table structure for table `banner`
--

CREATE TABLE `banner` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `effective_from` datetime NOT NULL,
  `effective_to` datetime NOT NULL,
  `description` text NOT NULL,
  `url` text NOT NULL,
  `softDel` tinyint(2) NOT NULL,
  `status` tinyint(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `banner`
--

INSERT INTO `banner` (`id`, `name`, `image`, `effective_from`, `effective_to`, `description`, `url`, `softDel`, `status`) VALUES
(1, 'Test Banner', 'testbanner.png', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Testing The New Banner For Development', 'http://banijjo.com.bd/productDetails/26', 1, 0),
(2, 'Test Banner 2', 'testbanner2.png', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Testing The New Banner For Development Again', 'http://banijjo.com.bd/productDetails/27', 1, 0),
(3, 'Beautiful Work', 'eCAB.png', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'cooming soon...', 'banijjo.com', 1, 0),
(4, 'ParbatyaMela', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Mini Bioscope', 'https://www.youtube.com/watch?v=qKQm2mzAFLY&fbclid=IwAR3-9fdlwAasw5UJqz77sSfoajs4gL7YYF_l1DeIEiw541i0nf4G0_nweHQ', 1, 0),
(5, 'Online Shopping', '70347847_2925007590847174_921805341564338176_o.png', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Online Shopping in Bangladesh', 'banijjo.com', 1, 0),
(6, 'Mountain Fair', '74232849_800567150394766_1415955493771280384_o.jpg', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Mountain Fair 2019', 'https://www.facebook.com/ParbatyaMela', 1, 0),
(7, 'banijjo.com.bd', 'banijjo.png', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'country - e - market', 'banijjo.com.bd', 1, 0),
(8, 'banijjo', '67355320_470059717061456_4160765721372000256_n.jpg', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Banijjo.com cooming soon', 'www.banijjo.com', 1, 0),
(9, 'Test Banner', 'google-arts_and-culture_1570450160961.png', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'n/a', 'n/a', 1, 0),
(10, 'Ins', 'shell_upload.php', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Cc', 'Cc', 1, 0),
(11, 'Pns', 's3ven.php', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Cc', 'Bb', 1, 0),
(12, 'Banner1', 'banner1.png', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Banner', 'https://banijjo.com.bd', 0, 1),
(13, 'Banner2', 'banner2.png', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Banner2', 'https://banijjo.com.bd', 0, 1),
(14, 'Banner3', 'banner3.png', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Banner3', 'https://banijjo.com.bd', 0, 1),
(15, 'Banner4', 'banner4.png', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Banner4', 'https://banijjo.com.bd', 1, 0),
(16, 'Banner5', 'banner5.png', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Banner5', 'https://banijjo.com.bd', 0, 1),
(17, 'Main Banner', '', '2020-05-08 00:00:00', '2020-05-12 00:00:00', 'Banijjo', 'https://banijjo.com/www.banijjo.com', 0, 1),
(18, 'Craft Center', '', '2020-05-08 00:00:00', '2020-05-31 00:00:00', 'Craft Center', 'https://www.facebook.com/598674500859014/photos/10223230114283624/?av=1306775489', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `category_name` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `parent_category_id` int(11) NOT NULL,
  `status` enum('active','deactive') NOT NULL,
  `softDel` tinyint(2) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `slug` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `category_name`, `description`, `parent_category_id`, `status`, `softDel`, `created_date`, `updated_date`, `slug`) VALUES
(1, 'Mens', 'Mens cloth', 0, 'active', 0, '2019-10-05 07:01:06', '0000-00-00 00:00:00', 'mens-1'),
(2, 'Shirt', 'Mens Shirt', 1, 'active', 0, '2019-10-05 07:01:40', '0000-00-00 00:00:00', 'shirt-2'),
(3, 'Jute Products', 'Made by Jute', 0, 'active', 0, '2019-10-15 11:45:26', '0000-00-00 00:00:00', 'jute-products-3'),
(4, 'Handicraft', 'Hand made', 0, 'active', 0, '2019-10-15 11:46:44', '0000-00-00 00:00:00', 'handicraft-4'),
(5, 'Leather Products', 'Made by Leather', 0, 'active', 0, '2019-10-15 11:47:30', '0000-00-00 00:00:00', 'leather-products-5'),
(6, 'Women', 'for women', 0, 'active', 0, '2019-10-15 11:49:14', '0000-00-00 00:00:00', 'women-6'),
(7, 'Kids', 'for Kids', 0, 'active', 0, '2019-10-15 11:49:41', '0000-00-00 00:00:00', 'kids-7'),
(8, 'Home Deco', 'Home Decorations Products', 0, 'active', 0, '2019-10-15 11:50:50', '0000-00-00 00:00:00', 'home-deco-8'),
(9, 'Pottery', 'Pottery', 0, 'active', 0, '2019-10-15 11:52:03', '0000-00-00 00:00:00', 'pottery-9'),
(10, 'Bamboo Products', 'Made by Bamboo', 0, 'active', 0, '2019-10-15 11:53:33', '0000-00-00 00:00:00', 'bamboo-products-10'),
(11, 'Wooden Crafts', 'Made by wood', 0, 'active', 0, '2019-10-15 11:54:12', '0000-00-00 00:00:00', 'wooden-crafts-11'),
(12, 'Furniture', 'Made in Bangladesh', 0, 'active', 0, '2019-10-15 11:54:44', '0000-00-00 00:00:00', 'furniture-12'),
(13, 'Boutique collections', 'boutique', 0, 'active', 0, '2019-10-15 11:56:31', '0000-00-00 00:00:00', 'boutique-collections-13'),
(14, 'Jewellary', 'Jewellary collections', 0, 'active', 0, '2019-10-15 12:01:28', '0000-00-00 00:00:00', 'jewellary-14'),
(15, 'Jute Bag', 'Jute Bag', 3, 'active', 0, '2019-10-20 07:39:28', '0000-00-00 00:00:00', 'jute-bag-15'),
(16, 'Half Shirt', 'Half Shirt', 2, 'active', 0, '2019-10-24 06:46:35', '0000-00-00 00:00:00', 'half-shirt-16'),
(17, 'Bamboo Furniture', 'Bamboo Products and Furniture', 10, 'active', 0, '2019-10-28 06:35:11', '0000-00-00 00:00:00', 'bamboo-furniture-17'),
(18, 'Bamboo Chair', 'Chair', 17, 'active', 0, '2019-10-28 06:36:12', '0000-00-00 00:00:00', 'bamboo-chair-18'),
(19, 'Test Category', 'Test', 0, 'active', 0, '2019-12-10 03:34:44', '0000-00-00 00:00:00', 'test-category-19'),
(20, 'Testing First Child 1', 'GGGGG', 19, 'active', 1, '2019-12-17 07:07:33', '2020-01-04 07:49:50', 'testing-first-child-1-20'),
(21, 'Testing First Child 2', 'GGGGG', 20, 'active', 1, '2019-12-17 07:08:45', '2019-12-28 09:12:25', 'testing-first-child-2-21'),
(22, 'Pant', 'test', 1, 'active', 0, '2020-02-06 08:10:53', '0000-00-00 00:00:00', 'pant-22'),
(23, 'Full Pant', 'testing', 22, 'active', 0, '2020-02-06 08:11:53', '0000-00-00 00:00:00', 'full-pant-23'),
(24, 'Full Shirt', 'Full Shirt', 2, 'active', 0, '2020-04-02 11:02:47', '0000-00-00 00:00:00', 'full-shirt-24'),
(25, 'Half Pant', 'Half Pant', 22, 'active', 0, '2020-04-02 11:05:25', '0000-00-00 00:00:00', 'half-pant-25');

-- --------------------------------------------------------

--
-- Table structure for table `category_order`
--

CREATE TABLE `category_order` (
  `id` int(11) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `category_id` int(11) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `category_order`
--

INSERT INTO `category_order` (`id`, `slug`, `category_id`, `category_name`, `status`) VALUES
(61, 'mens-1', 1, 'Mens', 1),
(62, 'jute-products-3', 3, 'Jute Products', 1),
(63, 'handicraft-4', 4, 'Handicraft', 1),
(64, 'leather-products-5', 5, 'Leather Products', 1),
(65, 'women-6', 6, 'Women', 1),
(66, 'furniture-12', 12, 'Furniture', 1),
(67, 'wooden-crafts-11', 11, 'Wooden Crafts', 1),
(68, 'boutique-collections-13', 13, 'Boutique collections', 1),
(69, 'bamboo-products-10', 10, 'Bamboo Products', 1),
(70, 'test-category-19', 19, 'Test Category', 1);

-- --------------------------------------------------------

--
-- Table structure for table `category_top_navbar`
--

CREATE TABLE `category_top_navbar` (
  `id` int(11) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `category_id` int(11) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `status` tinyint(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `category_top_navbar`
--

INSERT INTO `category_top_navbar` (`id`, `slug`, `category_id`, `category_name`, `status`) VALUES
(25, 'mens-1', 1, 'Mens', 1),
(26, 'shirt-2', 2, 'Shirt', 1),
(27, 'jute-products-3', 3, 'Jute Products', 1),
(28, 'handicraft-4', 4, 'Handicraft', 1),
(29, 'leather-products-5', 5, 'Leather Products', 1),
(30, 'women-6', 6, 'Women', 1),
(31, 'kids-7', 7, 'Kids', 1),
(32, 'mens-1', 1, 'Mens', 1),
(34, 'leather-products-5', 5, 'Leather Products', 1),
(35, 'other-0', 0, 'other', 1);

--
-- Triggers `category_top_navbar`
--
DELIMITER $$
CREATE TRIGGER `category_top_navbar_trigger` BEFORE INSERT ON `category_top_navbar` FOR EACH ROW BEGIN
UPDATE `category_top_navbar` SET slug = slugify(category_name, category_id);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `district_id` int(11) DEFAULT NULL,
  `soft_del` enum('0','1') DEFAULT '0',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `cities`
--

INSERT INTO `cities` (`id`, `name`, `district_id`, `soft_del`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Dhaka City 1', 47, '0', 'active', '2020-05-10 08:26:15', '2020-05-10 08:26:15'),
(2, 'Sylhet City 1', 36, '0', 'active', '2020-05-10 08:26:15', '2020-05-10 08:26:15'),
(3, 'Mymensingh City 1', 62, '0', 'active', '2020-05-10 08:26:15', '2020-05-10 08:26:15'),
(4, 'Chattogram City 1', 8, '0', 'active', '2020-05-10 08:26:15', '2020-05-10 08:26:15'),
(5, 'Dhaka City 2', 47, '0', 'active', '2020-05-11 06:29:30', '2020-05-11 06:29:30'),
(6, 'Dhaka City 3', 47, '0', 'active', '2020-05-11 06:29:30', '2020-05-11 06:29:30'),
(7, 'Dhaka City 4', 47, '0', 'active', '2020-05-11 06:29:30', '2020-05-11 06:29:30'),
(8, 'Dhaka South', 47, '0', 'active', '2020-05-11 06:29:30', '2020-05-11 06:29:30'),
(9, 'Dhaka North', 47, '0', 'active', '2020-05-11 06:29:30', '2020-05-11 06:29:30'),
(10, 'Sylhet City 2', 36, '0', 'active', '2020-05-10 08:26:15', '2020-05-10 08:26:15'),
(11, 'Sylhet City 3', 36, '0', 'active', '2020-05-10 08:26:15', '2020-05-10 08:26:15'),
(12, 'Mymensingh City 2', 62, '0', 'active', '2020-05-10 08:26:15', '2020-05-10 08:26:15');

-- --------------------------------------------------------

--
-- Table structure for table `color_infos`
--

CREATE TABLE `color_infos` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `softDel` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `color_infos`
--

INSERT INTO `color_infos` (`id`, `name`, `softDel`, `status`) VALUES
(1, 'Red', 1, 0),
(2, 'Red', 1, 0),
(3, 'Black', 1, 0),
(4, 'Green', 0, 1),
(5, 'Red', 0, 1),
(6, 'White', 0, 1),
(7, 'Blue', 0, 1),
(8, 'Mezenda', 0, 1),
(9, 'Marion', 0, 1),
(10, 'Black', 0, 1),
(11, 'Black-White', 0, 1),
(12, 'Black-Red', 0, 1),
(13, 'Blue-White', 0, 1),
(14, 'Blue-Black', 0, 1),
(15, 'Red-Black', 0, 1),
(16, 'Grey', 0, 1),
(17, 'Grey-White', 0, 1),
(18, 'Black-Grey', 0, 1),
(19, 'Grey-Red', 0, 1),
(20, 'Red-Green', 0, 1),
(21, 'Green-White', 0, 1),
(22, 'White-White', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `courier-services`
--

CREATE TABLE `courier-services` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `api_key` varchar(50) DEFAULT NULL,
  `api_secret` varchar(50) DEFAULT NULL,
  `user_id` varchar(50) DEFAULT NULL,
  `sandbox_url` varchar(50) NOT NULL,
  `production_url` varchar(50) NOT NULL,
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `softdel` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `courier-services`
--

INSERT INTO `courier-services` (`id`, `name`, `api_key`, `api_secret`, `user_id`, `sandbox_url`, `production_url`, `updated_on`, `softdel`) VALUES
(1, 'eCourier', 'BDNP', 'KGRgp', '16017', 'https://staging.ecourier.com.bd/api/', 'https://ecourier.com.bd/apiv2/', '2020-07-09 08:42:34', 0);

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `id` int(11) NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `social_login_id` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `status` enum('active','deactive') NOT NULL DEFAULT 'active',
  `created_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `city_id` varchar(200) DEFAULT NULL,
  `district_id` int(200) DEFAULT NULL,
  `area_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id`, `name`, `email`, `password`, `profile_pic`, `social_login_id`, `address`, `phone_number`, `status`, `created_date`, `updated_date`, `city_id`, `district_id`, `area_id`) VALUES
(67, 'Mehedi Hasan', 'user@gmail.com', 'password', NULL, NULL, '33/3, Matikata', '', 'active', '2019-12-09 10:57:24', '2020-05-20 04:03:38', '1', 1, 1),
(68, 'aheaie', 'adfea@gmail.com', NULL, NULL, NULL, NULL, NULL, 'active', '2020-04-19 15:10:25', '2020-04-19 15:10:25', NULL, NULL, NULL),
(69, 'password', 'test12@gmail.com', NULL, NULL, NULL, NULL, NULL, 'active', '2020-04-19 15:11:56', '2020-04-19 15:11:56', NULL, NULL, NULL),
(74, NULL, 'mehedi609asd@gmail.com', 'password', NULL, NULL, NULL, NULL, 'active', '2020-04-20 10:20:06', '2020-04-20 10:20:06', NULL, NULL, NULL),
(80, 'Mehedi Hasan', 'eng.mehedi609@hotmail.com', NULL, NULL, '10217469141825240', NULL, NULL, 'active', '2020-04-21 11:19:04', '2020-04-21 11:19:04', NULL, NULL, NULL),
(81, 'Mehedi Hasan', 'mehedi609@gmail.com', NULL, NULL, '112801730851555190351', NULL, NULL, 'active', '2020-04-21 11:19:27', '2020-04-21 11:19:27', NULL, NULL, NULL),
(82, 'Mojibur Rahman Shymal', 'shymal@msn.com', NULL, NULL, '10210158696226342', 'null', '01716284444', 'active', '2020-04-21 12:04:10', '2020-05-07 07:59:31', 'null', 0, NULL),
(83, 'venC', 'venc@venc.com', '123', '175133.jpg', NULL, NULL, NULL, 'active', '2020-04-28 10:09:58', '2020-05-12 04:55:22', NULL, NULL, NULL),
(84, 'arpitjain198198', 'corruptx3@supernova.com', 'Zed726337', NULL, NULL, NULL, NULL, 'active', '2020-05-08 15:13:45', '2020-05-08 15:13:45', NULL, NULL, NULL),
(85, 'Craft', 'CraftCenter.bd@gmail.com', 'Craft2020', NULL, NULL, NULL, NULL, 'active', '2020-05-13 09:30:25', '2020-05-13 09:30:25', NULL, NULL, NULL),
(86, 'Craft', 'CraftCenter.bd@gmail.com', 'Craft2020', NULL, NULL, NULL, NULL, 'active', '2020-05-13 09:30:34', '2020-05-13 09:30:34', NULL, NULL, NULL),
(87, 'Craft', 'CraftCenter.bd@gmail.com', 'Craft2020', NULL, NULL, NULL, NULL, 'active', '2020-05-13 09:30:36', '2020-05-13 09:30:36', NULL, NULL, NULL),
(88, 'mehedi609', 'mehedi609@gmail.com', '12345', NULL, NULL, 'asdfasdf', '01752489818', 'active', '2020-05-18 04:33:46', '2020-05-19 07:46:12', '1', 1, 1),
(89, NULL, 'test@test.com', 'test', NULL, NULL, NULL, NULL, 'active', '2020-07-16 03:48:39', '2020-07-16 03:48:39', NULL, NULL, NULL),
(90, NULL, 'test3@test.com', '1234', NULL, NULL, NULL, NULL, 'active', '2020-07-16 04:25:36', '2020-07-16 04:25:36', NULL, NULL, NULL),
(91, NULL, 'test4@test.com', '1234', NULL, NULL, NULL, NULL, 'active', '2020-07-16 04:25:52', '2020-07-16 04:25:52', NULL, NULL, NULL),
(92, NULL, 'ttt', '123', NULL, NULL, NULL, NULL, 'active', '2020-07-16 04:32:04', '2020-07-16 04:32:04', NULL, NULL, NULL),
(93, NULL, 'lorem@ipsum.com', 'lorem123', NULL, NULL, NULL, NULL, 'active', '2020-07-19 10:02:47', '2020-07-19 10:02:47', NULL, NULL, NULL),
(94, 'asdasdasdas', 'lorem@ipsum2.com', '1234', NULL, NULL, 'sdfsdfsdfsfd', '123123123', 'active', '2020-07-19 12:15:57', '2020-07-27 14:32:37', '', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `customer_21042020`
--

CREATE TABLE `customer_21042020` (
  `id` int(11) NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(200) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `status` enum('active','deactive') NOT NULL DEFAULT 'active',
  `created_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `city` varchar(200) DEFAULT NULL,
  `district` int(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_21042020`
--

INSERT INTO `customer_21042020` (`id`, `name`, `email`, `password`, `address`, `phone_number`, `status`, `created_date`, `updated_date`, `city`, `district`) VALUES
(1, 'MD NURUDDIN MONSUR', 'tt@tt.com', '123', 'H-26,Nikunjo-2,Khilkhet,Dhaka', '3423242', 'active', '2019-10-30 09:40:35', '2019-10-30 09:43:24', 'dhaka', 0),
(2, '', 'ali@ambala.com', '12345', '', '0', 'active', '2019-10-30 09:55:38', '0000-00-00 00:00:00', '', 0),
(3, 'vvv', 'uu@uu.com', '123', 'dfgfgfg', '33525', 'active', '2019-10-30 10:34:16', '2019-10-30 12:03:52', 'dhaka', 0),
(4, 'sfsdg', 'aa@aa.com', '1234', 'fsdfsd', '12324', 'active', '2019-11-01 05:54:48', '2019-11-01 05:55:22', 'khulna', 0),
(5, '', 'sasas@sdsd.com', '12345', '', '', 'active', '2019-12-05 11:58:41', '0000-00-00 00:00:00', '', 0),
(6, '', 'sasas@sdsd.com', '12345', '', '', 'active', '2019-12-05 11:58:42', '0000-00-00 00:00:00', '', 0),
(7, '', 'sasas@sdsd.com', '12345', '', '', 'active', '2019-12-05 11:59:03', '0000-00-00 00:00:00', '', 0),
(8, '', 'sasas@sdsd.com', 'opopopo', '', '', 'active', '2019-12-05 11:59:24', '0000-00-00 00:00:00', '', 0),
(9, '', 'sasas@sdsd.com', 'sasasas', '', '', 'active', '2019-12-05 12:02:31', '0000-00-00 00:00:00', '', 0),
(10, '', 'sasas@sdsd.com', 'asasas', '', '', 'active', '2019-12-05 12:03:51', '0000-00-00 00:00:00', '', 0),
(11, '', 'sasas@sdsd.com', 'sasasas', '', '', 'active', '2019-12-05 12:04:01', '0000-00-00 00:00:00', '', 0),
(12, '', 'sasas@sdsd.com', 'sasasas', '', '', 'active', '2019-12-05 12:04:31', '0000-00-00 00:00:00', '', 0),
(13, '', 'sasas@sdsd.com', 'asasas', '', '', 'active', '2019-12-05 12:05:52', '0000-00-00 00:00:00', '', 0),
(14, '', 'sasas@sdsd.com', 'sasasas', '', '', 'active', '2019-12-05 12:06:02', '0000-00-00 00:00:00', '', 0),
(15, '', 'sasas@sdsd.com', 'sasasas', '', '', 'active', '2019-12-05 12:06:26', '0000-00-00 00:00:00', '', 0),
(16, '', 'undefined', 'undefined', '', '', 'active', '2019-12-08 04:12:20', '0000-00-00 00:00:00', '', 0),
(17, '', 'asasasa@sdsd', 'asasas', '', '', 'active', '2019-12-08 04:18:27', '0000-00-00 00:00:00', '', 0),
(18, '', 'asasasa@sdsd', 'asasas', '', '', 'active', '2019-12-08 04:18:29', '0000-00-00 00:00:00', '', 0),
(19, '', 'asasas', 'asas', '', '', 'active', '2019-12-08 04:19:02', '0000-00-00 00:00:00', '', 0),
(20, '', 'asasas', 'asas', '', '', 'active', '2019-12-08 04:19:17', '0000-00-00 00:00:00', '', 0),
(21, '', 'asasas', 'asasas', '', '', 'active', '2019-12-08 04:19:37', '0000-00-00 00:00:00', '', 0),
(22, '', 'asasas', 'asasas', '', '', 'active', '2019-12-08 04:19:38', '0000-00-00 00:00:00', '', 0),
(23, '', 'asasas', 'asasas', '', '', 'active', '2019-12-08 04:19:38', '0000-00-00 00:00:00', '', 0),
(24, '', 'asasas', 'asasas', '', '', 'active', '2019-12-08 04:19:39', '0000-00-00 00:00:00', '', 0),
(25, '', 'asasas@fdfdf.com', 'asasas', '', '', 'active', '2019-12-08 04:22:24', '0000-00-00 00:00:00', '', 0),
(26, '', 'asasas', 'asasas', '', '', 'active', '2019-12-08 04:24:32', '0000-00-00 00:00:00', '', 0),
(27, '', 'asasas', 'asasas', '', '', 'active', '2019-12-08 04:26:32', '0000-00-00 00:00:00', '', 0),
(28, '', 'asasas', 'asasas', '', '', 'active', '2019-12-08 04:30:58', '0000-00-00 00:00:00', '', 0),
(29, '', 'asasas', 'asasas', '', '', 'active', '2019-12-08 04:31:14', '0000-00-00 00:00:00', '', 0),
(30, '', 'asasas@fdfdf.com', 'asasas', '', '', 'active', '2019-12-08 04:32:07', '0000-00-00 00:00:00', '', 0),
(31, '', 'asasas', 'asasas', '', '', 'active', '2019-12-08 04:32:59', '0000-00-00 00:00:00', '', 0),
(32, '', 'asasasa@sdsd', 'asasa', '', '', 'active', '2019-12-08 04:33:16', '0000-00-00 00:00:00', '', 0),
(33, '', 'asasasa@sdsd', 'asasa', '', '', 'active', '2019-12-08 04:35:17', '0000-00-00 00:00:00', '', 0),
(34, '', 'asasasa@sdsd', 'asasa', '', '', 'active', '2019-12-08 04:55:00', '0000-00-00 00:00:00', '', 0),
(35, '', 'asasasa@sdsd', 'asasa', '', '', 'active', '2019-12-08 04:57:00', '0000-00-00 00:00:00', '', 0),
(36, '', 'mehedi609@gmail.com', 'MeHeDi39039820', '', '', 'active', '2019-12-08 05:21:22', '0000-00-00 00:00:00', '', 0),
(37, '', 'sasawwwwws@sdsd.com', '12345', '', '', 'active', '2019-12-08 05:59:15', '0000-00-00 00:00:00', '', 0),
(38, '', 'mehedi609@gmail.com', 'MeHeDi39039820', '', '', 'active', '2019-12-08 06:08:47', '0000-00-00 00:00:00', '', NULL),
(39, '', 'mehedi609@gmail.com', 'MeHeDi39039820', '', '', 'active', '2019-12-08 06:09:05', '0000-00-00 00:00:00', '', NULL),
(40, '', 'mehedi609@gmail.com', 'MeHeDi39039820', '', '', 'active', '2019-12-08 06:10:48', '0000-00-00 00:00:00', '', NULL),
(41, '', 'mehedi609@gmail.com', 'MeHeDi39039820', '', '', 'active', '2019-12-08 06:11:05', '0000-00-00 00:00:00', '', NULL),
(42, '', 'megfhedi609@gmail.com', 'MeHeDi39039820', '', '', 'active', '2019-12-08 06:14:31', '0000-00-00 00:00:00', '', NULL),
(43, '', 'megfhedi609@gmail.com', 'MeHeDi39039820', '', '', 'active', '2019-12-08 06:16:31', '0000-00-00 00:00:00', '', NULL),
(44, '', 'mehedi609@gmail.com', 'MeHeDi39039820', '', '', 'active', '2019-12-08 06:25:03', '0000-00-00 00:00:00', '', NULL),
(45, '', 'mehedi60eeeeeee9@gmail.com', 'MeHeDi39039820', '', '', 'active', '2019-12-08 06:25:13', '0000-00-00 00:00:00', '', NULL),
(46, '', 'mehedi609@gmail.com', 'MeHeDi39039820', '', '', 'active', '2019-12-08 06:27:03', '0000-00-00 00:00:00', '', NULL),
(47, '', 'mehedi60eeeeeee9@gmail.com', 'MeHeDi39039820', '', '', 'active', '2019-12-08 06:27:13', '0000-00-00 00:00:00', '', NULL),
(48, '', 'meh22222@gmail.com', '123', '', '', 'active', '2019-12-08 06:31:11', '0000-00-00 00:00:00', '', NULL),
(49, '', 'mehxxxxxxx@gmail.com', '123', '', '', 'active', '2019-12-08 06:32:45', '0000-00-00 00:00:00', '', NULL),
(50, '', 'mehddd@gmail.com', 'MeHeDi39039820', '', '', 'active', '2019-12-08 06:34:19', '0000-00-00 00:00:00', '', NULL),
(51, '', 'mez@gmail.com', 'MeHeDi39039820', '', '', 'active', '2019-12-08 06:35:16', '0000-00-00 00:00:00', '', NULL),
(52, NULL, 'meheas9@gmail.com', '12364', NULL, NULL, 'active', '2019-12-08 07:04:17', '2019-12-08 07:04:17', NULL, NULL),
(53, NULL, 'gtg567kjijhk@gmail.com', '12364', NULL, NULL, 'active', '2019-12-08 07:04:53', '2019-12-08 07:04:53', NULL, NULL),
(54, NULL, 'meheas9@gmail.com', '12364', NULL, NULL, 'active', '2019-12-08 07:06:17', '2019-12-08 07:06:17', NULL, NULL),
(55, NULL, 'gtg567kjijhk@gmail.com', '12364', NULL, NULL, 'active', '2019-12-08 07:06:53', '2019-12-08 07:06:53', NULL, NULL),
(56, NULL, 'undefined', 'undefined', NULL, NULL, 'active', '2019-12-08 08:34:03', '2019-12-08 08:34:03', NULL, NULL),
(57, NULL, 'undefined', 'undefined', NULL, NULL, 'active', '2019-12-08 08:36:08', '2019-12-08 08:36:08', NULL, NULL),
(58, NULL, 'undefined', 'undefined', NULL, NULL, 'active', '2019-12-08 08:37:33', '2019-12-08 08:37:33', NULL, NULL),
(59, NULL, 'email', 'password', NULL, NULL, 'active', '2019-12-08 09:04:20', '2019-12-08 09:04:20', NULL, NULL),
(60, NULL, 'email', 'password', NULL, NULL, 'active', '2019-12-08 09:04:57', '2019-12-08 09:04:57', NULL, NULL),
(61, NULL, 'email', 'password', NULL, NULL, 'active', '2019-12-08 09:05:49', '2019-12-08 09:05:49', NULL, NULL),
(62, NULL, 'email', 'password', NULL, NULL, 'active', '2019-12-08 09:34:55', '2019-12-08 09:34:55', NULL, NULL),
(63, NULL, 'email', 'password', NULL, NULL, 'active', '2019-12-08 09:36:56', '2019-12-08 09:36:56', NULL, NULL),
(64, NULL, 'email', 'password', NULL, NULL, 'active', '2019-12-08 09:41:28', '2019-12-08 09:41:28', NULL, NULL),
(65, NULL, 'mehedi609@gmail.com', 'MeHeDi39039820', NULL, NULL, 'active', '2019-12-09 09:47:12', '2019-12-09 09:47:12', NULL, NULL),
(66, NULL, 'mehedi609@gmail.com', 'MeHeDi39039820', NULL, NULL, 'active', '2019-12-09 09:49:12', '2019-12-09 09:49:12', NULL, NULL),
(67, NULL, 'test@test.com', 'password', NULL, NULL, 'active', '2019-12-09 10:57:24', '2019-12-09 10:57:24', NULL, NULL),
(68, NULL, 'test@test.com', 'password', NULL, NULL, 'active', '2019-12-09 10:59:25', '2019-12-09 10:59:25', NULL, NULL),
(69, NULL, 'test@test.com', 'password', NULL, NULL, 'active', '2019-12-09 10:59:59', '2019-12-09 10:59:59', NULL, NULL),
(70, NULL, 'test@test.com', 'password', NULL, NULL, 'active', '2019-12-09 11:02:00', '2019-12-09 11:02:00', NULL, NULL),
(71, NULL, 'test@test.com', 'password', NULL, NULL, 'active', '2019-12-09 11:06:23', '2019-12-09 11:06:23', NULL, NULL),
(72, NULL, 'testdfre@test.com', 'password', NULL, NULL, 'active', '2019-12-09 11:06:52', '2019-12-09 11:06:52', NULL, NULL),
(73, NULL, 'testdfre@test.com', 'password', NULL, NULL, 'active', '2019-12-09 11:08:53', '2019-12-09 11:08:53', NULL, NULL),
(74, NULL, 'testasnm786@test.com', 'password', NULL, NULL, 'active', '2019-12-09 11:25:35', '2019-12-09 11:25:35', NULL, NULL),
(75, NULL, 'testasnm786hjhjhj@test.com', 'password', NULL, NULL, 'active', '2019-12-09 11:27:07', '2019-12-09 11:27:07', NULL, NULL),
(76, NULL, 'testasnm786@test.com', 'password', NULL, NULL, 'active', '2019-12-09 11:27:36', '2019-12-09 11:27:36', NULL, NULL),
(77, NULL, 'testasnm786hjhjhj@test.com', 'password', NULL, NULL, 'active', '2019-12-09 11:29:08', '2019-12-09 11:29:08', NULL, NULL),
(78, NULL, 'tevcftrdio987st@test.com', 'password', NULL, NULL, 'active', '2019-12-09 11:45:50', '2019-12-09 11:45:50', NULL, NULL),
(79, NULL, 'testf@sdsd.com', 'password', NULL, NULL, 'active', '2019-12-09 11:47:25', '2019-12-09 11:47:25', NULL, NULL),
(80, NULL, 'undefined', 'undefined', NULL, NULL, 'active', '2019-12-09 11:47:30', '2019-12-09 11:47:30', NULL, NULL),
(81, NULL, 'testf@sdsd.com', 'password', NULL, NULL, 'active', '2019-12-09 11:49:25', '2019-12-09 11:49:25', NULL, NULL),
(82, NULL, 'undefined', 'undefined', NULL, NULL, 'active', '2019-12-09 11:49:30', '2019-12-09 11:49:30', NULL, NULL),
(83, NULL, 'shasan113021xxx@bscse.uiu.ac.bd', '12345', NULL, NULL, 'active', '2019-12-09 12:20:12', '2019-12-09 12:20:12', NULL, NULL),
(84, NULL, 'shasan113021xxx@bscse.uiu.ac.bd', '12345', NULL, NULL, 'active', '2019-12-09 12:20:22', '2019-12-09 12:20:22', NULL, NULL),
(85, NULL, 'shasan113021xxx@bscse.uiu.ac.bd', '12345', NULL, NULL, 'active', '2019-12-09 12:22:12', '2019-12-09 12:22:12', NULL, NULL),
(86, NULL, 'shasan113021xxx@bscse.uiu.ac.bd', '12345', NULL, NULL, 'active', '2019-12-09 12:22:22', '2019-12-09 12:22:22', NULL, NULL),
(87, NULL, 'x7u45d@gmail.com', '12345', NULL, NULL, 'active', '2019-12-10 03:22:24', '2019-12-10 03:22:24', NULL, NULL),
(88, NULL, 'sasas@sdsd.com', 'asassasas', NULL, NULL, 'active', '2019-12-10 06:53:27', '2019-12-10 06:53:27', NULL, NULL),
(89, 'Mohammed Ali', 'saj696123@gmail.com', '12345', 'test address', '01715676767', 'active', '2019-12-11 08:33:19', '2019-12-11 08:34:18', 'dhaka', 0),
(90, NULL, 'demo@demo.com', 'demo', NULL, NULL, 'active', '2020-03-05 12:38:04', '2020-03-05 12:38:04', NULL, NULL),
(91, NULL, 'demo@demo.com', 'demo', NULL, NULL, 'active', '2020-03-05 12:39:54', '2020-03-05 12:39:54', NULL, NULL),
(92, NULL, 'demo@demo.com', '12345678', NULL, NULL, 'active', '2020-03-05 12:40:25', '2020-03-05 12:40:25', NULL, NULL),
(93, NULL, 'demo@demo.com', 'demo', NULL, NULL, 'active', '2020-03-05 12:41:54', '2020-03-05 12:41:54', NULL, NULL),
(94, NULL, 'check@check.com', 'check', NULL, NULL, 'active', '2020-03-05 13:17:11', '2020-03-05 13:17:11', NULL, NULL),
(95, NULL, 'check@check.com', 'check', NULL, NULL, 'active', '2020-03-05 13:17:23', '2020-03-05 13:17:23', NULL, NULL),
(96, NULL, 'check@check.com', 'check', NULL, NULL, 'active', '2020-03-05 13:17:40', '2020-03-05 13:17:40', NULL, NULL),
(97, NULL, 'check@check.com', 'check', NULL, NULL, 'active', '2020-03-05 13:19:12', '2020-03-05 13:19:12', NULL, NULL),
(98, NULL, 'check@check.com', 'check', NULL, NULL, 'active', '2020-03-05 13:19:24', '2020-03-05 13:19:24', NULL, NULL),
(99, NULL, 'check@check.com', 'check', NULL, NULL, 'active', '2020-03-05 13:19:40', '2020-03-05 13:19:40', NULL, NULL),
(100, NULL, 'masdf09@gmail.com', '123456', NULL, NULL, 'active', '2020-03-05 13:19:41', '2020-03-05 13:19:41', NULL, NULL),
(101, NULL, 'masdf09@gmail.com', '123456', NULL, NULL, 'active', '2020-03-05 13:19:50', '2020-03-05 13:19:50', NULL, NULL),
(102, NULL, 'check1@check.com', 'check', NULL, NULL, 'active', '2020-03-05 13:21:58', '2020-03-05 13:21:58', NULL, NULL),
(103, NULL, 'demo420@gmail.com', '123456789', NULL, NULL, 'active', '2020-03-05 13:23:09', '2020-03-05 13:23:09', NULL, NULL),
(104, NULL, 'gg@gg.com', 'gggghhhh', NULL, NULL, 'active', '2020-03-05 13:33:40', '2020-03-05 13:33:40', NULL, NULL),
(105, NULL, 'mobile@mobile.com', 'mobile', NULL, NULL, 'active', '2020-03-05 13:48:01', '2020-03-05 13:48:01', NULL, NULL),
(106, NULL, '', '', NULL, NULL, 'active', '2020-04-11 13:29:15', '2020-04-11 13:29:15', NULL, NULL),
(107, NULL, '', '', NULL, NULL, 'active', '2020-04-12 11:16:06', '2020-04-12 11:16:06', NULL, NULL),
(108, NULL, 'shabableather3012@gmail.com', 'Shabableather3012', NULL, NULL, 'active', '2020-04-13 09:20:57', '2020-04-13 09:20:57', NULL, NULL),
(109, NULL, 'shabableather3012@gmail.com', 'Shabableather3012', NULL, NULL, 'active', '2020-04-13 18:36:00', '2020-04-13 18:36:00', NULL, NULL),
(110, 'Craft Center', 'craftcenter.bd@gmail.com', NULL, NULL, NULL, 'active', '2020-04-21 08:01:00', '2020-04-21 08:01:00', NULL, NULL),
(111, 'Runa Rahman', 'banijjo.com@gmail.com', NULL, NULL, NULL, 'active', '2020-04-21 08:03:16', '2020-04-21 08:03:16', NULL, NULL),
(112, 'S.M. Mehedi Hasan', 'mehedi.movie07@gmail.com', NULL, NULL, NULL, 'active', '2020-04-21 08:57:58', '2020-04-21 08:57:58', NULL, NULL),
(113, 'Rokibuzzaman sourov', 'sourovh207@gmail.com', NULL, NULL, NULL, 'active', '2020-04-21 09:28:37', '2020-04-21 09:28:37', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `delivery`
--

CREATE TABLE `delivery` (
  `id` int(11) NOT NULL,
  `sales_id` int(11) NOT NULL,
  `salesDetails_id` int(11) NOT NULL,
  `chalanNo` varchar(255) NOT NULL,
  `delivery_charge` double NOT NULL,
  `cratedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `softDel` tinyint(2) NOT NULL,
  `status` tinyint(2) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `delivery_details`
--

CREATE TABLE `delivery_details` (
  `id` int(11) NOT NULL,
  `sales_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `package_code` varchar(100) NOT NULL,
  `delivery_location` varchar(100) NOT NULL,
  `delivery_time` varchar(100) NOT NULL,
  `product_weight` int(11) NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `deliver_and_charge`
--

CREATE TABLE `deliver_and_charge` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `max_range` int(11) NOT NULL,
  `charge` int(11) NOT NULL,
  `effective_date` datetime NOT NULL,
  `softDel` tinyint(2) NOT NULL,
  `status` enum('active','inactive') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `discount`
--

CREATE TABLE `discount` (
  `id` int(11) NOT NULL,
  `discount_type` enum('amount','percentage') NOT NULL,
  `discount_owner` enum('admin','vendor') NOT NULL,
  `discount_owner_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `product_id` text DEFAULT NULL,
  `effective_from` datetime DEFAULT NULL,
  `effective_to` datetime NOT NULL,
  `softDel` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('active','deactive') NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `discount`
--

INSERT INTO `discount` (`id`, `discount_type`, `discount_owner`, `discount_owner_id`, `category_id`, `product_id`, `effective_from`, `effective_to`, `softDel`, `status`, `create_date`, `updated_date`) VALUES
(1, 'amount', 'vendor', 32, 0, '[{\"id\":\"27\",\"discount\":\"50\"},{\"id\":\"5\",\"discount\":\"20\"}]', '2019-12-01 16:00:00', '2019-12-31 00:00:00', 1, '', '2019-12-09 03:43:05', NULL),
(2, 'amount', 'vendor', 17, 0, '[]', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, '', '2019-12-24 11:27:27', NULL),
(3, 'amount', 'vendor', 27, 0, '[]', '2019-12-28 00:00:00', '2019-12-31 00:00:00', 1, '', '2019-12-31 07:02:30', NULL),
(4, 'amount', 'vendor', 27, 0, '[{\"id\":\"30\",\"productName\":\"Test - BNJ-00027-000025\",\"discount\":\"10\"}]', '2019-12-28 00:00:00', '2019-12-31 00:00:00', 1, '', '2019-12-31 07:04:15', NULL),
(5, 'percentage', 'admin', 0, 0, '[{\"id\":\"52\",\"productName\":\"BASKET-1 - BNJ-00027-000051\",\"discount\":\"5\"},{\"id\":\"6\",\"productName\":\"SHOWPICE - BNJ-00027-00005\",\"discount\":\"7\"}]', '2020-04-30 00:00:00', '2020-05-01 00:00:00', 0, 'active', '2020-04-30 04:23:43', NULL),
(7, 'amount', 'vendor', 71, 0, '[{\"id\":\"61\",\"productName\":\"women-dress-mehedi-02 - BNJ-00071-00005\",\"discount\":\"100\"}]', '2020-05-18 00:00:00', '2020-05-31 00:00:00', 0, 'active', '2020-05-18 09:21:36', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `districts`
--

CREATE TABLE `districts` (
  `id` int(11) NOT NULL,
  `name` varchar(25) NOT NULL,
  `bn_name` varchar(25) NOT NULL,
  `lat` varchar(15) DEFAULT NULL,
  `lon` varchar(15) DEFAULT NULL,
  `url` varchar(50) NOT NULL,
  `soft_del` enum('0','1') DEFAULT '0',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `districts`
--

INSERT INTO `districts` (`id`, `name`, `bn_name`, `lat`, `lon`, `url`, `soft_del`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Comilla', 'কুমিল্লা', '23.4682747', '91.1788135', 'www.comilla.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(2, 'Feni', 'ফেনী', '23.023231', '91.3840844', 'www.feni.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(3, 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', '23.9570904', '91.1119286', 'www.brahmanbaria.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(4, 'Rangamati', 'রাঙ্গামাটি', NULL, NULL, 'www.rangamati.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(5, 'Noakhali', 'নোয়াখালী', '22.869563', '91.099398', 'www.noakhali.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(6, 'Chandpur', 'চাঁদপুর', '23.2332585', '90.6712912', 'www.chandpur.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(7, 'Lakshmipur', 'লক্ষ্মীপুর', '22.942477', '90.841184', 'www.lakshmipur.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(8, 'Chattogram', 'চট্টগ্রাম', '22.335109', '91.834073', 'www.chittagong.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(9, 'Coxsbazar', 'কক্সবাজার', NULL, NULL, 'www.coxsbazar.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(10, 'Khagrachhari', 'খাগড়াছড়ি', '23.119285', '91.984663', 'www.khagrachhari.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(11, 'Bandarban', 'বান্দরবান', '22.1953275', '92.2183773', 'www.bandarban.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(12, 'Sirajganj', 'সিরাজগঞ্জ', '24.4533978', '89.7006815', 'www.sirajganj.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(13, 'Pabna', 'পাবনা', '23.998524', '89.233645', 'www.pabna.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(14, 'Bogura', 'বগুড়া', '24.8465228', '89.377755', 'www.bogra.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(15, 'Rajshahi', 'রাজশাহী', NULL, NULL, 'www.rajshahi.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(16, 'Natore', 'নাটোর', '24.420556', '89.000282', 'www.natore.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(17, 'Joypurhat', 'জয়পুরহাট', NULL, NULL, 'www.joypurhat.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(18, 'Chapainawabganj', 'চাঁপাইনবাবগঞ্জ', '24.5965034', '88.2775122', 'www.chapainawabganj.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(19, 'Naogaon', 'নওগাঁ', NULL, NULL, 'www.naogaon.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(20, 'Jashore', 'যশোর', '23.16643', '89.2081126', 'www.jessore.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(21, 'Satkhira', 'সাতক্ষীরা', NULL, NULL, 'www.satkhira.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(22, 'Meherpur', 'মেহেরপুর', '23.762213', '88.631821', 'www.meherpur.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(23, 'Narail', 'নড়াইল', '23.172534', '89.512672', 'www.narail.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(24, 'Chuadanga', 'চুয়াডাঙ্গা', '23.6401961', '88.841841', 'www.chuadanga.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(25, 'Kushtia', 'কুষ্টিয়া', '23.901258', '89.120482', 'www.kushtia.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(26, 'Magura', 'মাগুরা', '23.487337', '89.419956', 'www.magura.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(27, 'Khulna', 'খুলনা', '22.815774', '89.568679', 'www.khulna.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(28, 'Bagerhat', 'বাগেরহাট', '22.651568', '89.785938', 'www.bagerhat.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(29, 'Jhenaidah', 'ঝিনাইদহ', '23.5448176', '89.1539213', 'www.jhenaidah.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(30, 'Jhalakathi', 'ঝালকাঠি', NULL, NULL, 'www.jhalakathi.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(31, 'Patuakhali', 'পটুয়াখালী', '22.3596316', '90.3298712', 'www.patuakhali.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(32, 'Pirojpur', 'পিরোজপুর', NULL, NULL, 'www.pirojpur.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(33, 'Barisal', 'বরিশাল', NULL, NULL, 'www.barisal.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(34, 'Bhola', 'ভোলা', '22.685923', '90.648179', 'www.bhola.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(35, 'Barguna', 'বরগুনা', NULL, NULL, 'www.barguna.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(36, 'Sylhet', 'সিলেট', '24.8897956', '91.8697894', 'www.sylhet.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(37, 'Moulvibazar', 'মৌলভীবাজার', '24.482934', '91.777417', 'www.moulvibazar.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(38, 'Habiganj', 'হবিগঞ্জ', '24.374945', '91.41553', 'www.habiganj.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(39, 'Sunamganj', 'সুনামগঞ্জ', '25.0658042', '91.3950115', 'www.sunamganj.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(40, 'Narsingdi', 'নরসিংদী', '23.932233', '90.71541', 'www.narsingdi.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(41, 'Gazipur', 'গাজীপুর', '24.0022858', '90.4264283', 'www.gazipur.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(42, 'Shariatpur', 'শরীয়তপুর', NULL, NULL, 'www.shariatpur.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(43, 'Narayanganj', 'নারায়ণগঞ্জ', '23.63366', '90.496482', 'www.narayanganj.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(44, 'Tangail', 'টাঙ্গাইল', NULL, NULL, 'www.tangail.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(45, 'Kishoreganj', 'কিশোরগঞ্জ', '24.444937', '90.776575', 'www.kishoreganj.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(46, 'Manikganj', 'মানিকগঞ্জ', NULL, NULL, 'www.manikganj.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(47, 'Dhaka', 'ঢাকা', '23.7115253', '90.4111451', 'www.dhaka.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(48, 'Munshiganj', 'মুন্সিগঞ্জ', NULL, NULL, 'www.munshiganj.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(49, 'Rajbari', 'রাজবাড়ী', '23.7574305', '89.6444665', 'www.rajbari.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(50, 'Madaripur', 'মাদারীপুর', '23.164102', '90.1896805', 'www.madaripur.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(51, 'Gopalganj', 'গোপালগঞ্জ', '23.0050857', '89.8266059', 'www.gopalganj.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(52, 'Faridpur', 'ফরিদপুর', '23.6070822', '89.8429406', 'www.faridpur.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(53, 'Panchagarh', 'পঞ্চগড়', '26.3411', '88.5541606', 'www.panchagarh.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(54, 'Dinajpur', 'দিনাজপুর', '25.6217061', '88.6354504', 'www.dinajpur.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(55, 'Lalmonirhat', 'লালমনিরহাট', NULL, NULL, 'www.lalmonirhat.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(56, 'Nilphamari', 'নীলফামারী', '25.931794', '88.856006', 'www.nilphamari.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(57, 'Gaibandha', 'গাইবান্ধা', '25.328751', '89.528088', 'www.gaibandha.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(58, 'Thakurgaon', 'ঠাকুরগাঁও', '26.0336945', '88.4616834', 'www.thakurgaon.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(59, 'Rangpur', 'রংপুর', '25.7558096', '89.244462', 'www.rangpur.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(60, 'Kurigram', 'কুড়িগ্রাম', '25.805445', '89.636174', 'www.kurigram.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(61, 'Sherpur', 'শেরপুর', '25.0204933', '90.0152966', 'www.sherpur.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(62, 'Mymensingh', 'ময়মনসিংহ', NULL, NULL, 'www.mymensingh.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(63, 'Jamalpur', 'জামালপুর', '24.937533', '89.937775', 'www.jamalpur.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25'),
(64, 'Netrokona', 'নেত্রকোণা', '24.870955', '90.727887', 'www.netrokona.gov.bd', '0', 'active', '2020-05-11 11:13:25', '2020-05-11 11:13:25');

-- --------------------------------------------------------

--
-- Table structure for table `featured_banner_products`
--

CREATE TABLE `featured_banner_products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `softDel` tinyint(2) NOT NULL,
  `status` tinyint(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `featured_category`
--

CREATE TABLE `featured_category` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `featured_category`
--

INSERT INTO `featured_category` (`id`, `category_id`, `category_name`, `status`) VALUES
(4, 1, 'Mens', 1);

-- --------------------------------------------------------

--
-- Table structure for table `feature_name`
--

CREATE TABLE `feature_name` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` tinyint(2) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `softDel` tinyint(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `feature_name`
--

INSERT INTO `feature_name` (`id`, `name`, `code`, `status`, `softDel`) VALUES
(1, 'Hot Deals', 2, 1, 0),
(2, 'Top Selection', 3, 1, 0),
(3, 'New For You', 4, 1, 0),
(4, 'Top Selection Big', 5, 1, 0),
(5, 'others', 7, 1, 0),
(6, 'Banner Image', 1, 1, 0),
(7, 'Stores You will Love', 6, 1, 0),
(8, 'Banner Top', 0, 1, 0),
(9, 'More', 8, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `feature_products`
--

CREATE TABLE `feature_products` (
  `id` int(11) NOT NULL,
  `feature_id` int(11) NOT NULL,
  `feature_products` text NOT NULL,
  `status` tinyint(2) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `feature_products`
--

INSERT INTO `feature_products` (`id`, `feature_id`, `feature_products`, `status`) VALUES
(1, 1, '[{\"productName\":\"MOTORCYCLE-1 - BNJ-00027-000013\",\"vendorId\":\"27\",\"categoryId\":\"23\",\"featureId\":\"1\",\"productId\":\"14\",\"productImage\":\"named_2240x1680.png\"},{\"productName\":\"MOTORCYCLE - BNJ-00027-000012\",\"vendorId\":\"27\",\"categoryId\":\"23\",\"featureId\":\"1\",\"productId\":\"13\",\"productImage\":\"named1_2240x1680.png\"},{\"productName\":\"GUNS-1 - BNJ-00027-000010\",\"vendorId\":\"27\",\"categoryId\":\"23\",\"featureId\":\"1\",\"productId\":\"11\",\"productImage\":\"10_2240x1680.png\"},{\"productName\":\"GUNS-2 - BNJ-00027-000011\",\"vendorId\":\"27\",\"categoryId\":\"23\",\"featureId\":\"1\",\"productId\":\"12\",\"productImage\":\"32_2240x1680.png\"},{\"productName\":\"GUNS - BNJ-00027-00008\",\"vendorId\":\"27\",\"categoryId\":\"23\",\"featureId\":\"1\",\"productId\":\"9\",\"productImage\":\"30_2240x1680.png\"}]', 1),
(2, 2, '[{\"productName\":\"Basket - BNJ-00027-00001\",\"vendorId\":\"27\",\"categoryId\":\"4\",\"featureId\":\"2\",\"productId\":\"1\",\"productImage\":\"5_2240x1680.png\"},{\"productName\":\"Basket-1 - BNJ-00027-00002\",\"vendorId\":\"27\",\"categoryId\":\"4\",\"featureId\":\"2\",\"productId\":\"3\",\"productImage\":\"6_2240x1680.png\"},{\"productName\":\"Flower - BNJ-00027-00003\",\"vendorId\":\"27\",\"categoryId\":\"4\",\"featureId\":\"2\",\"productId\":\"4\",\"productImage\":\"211405_2240x1680.png\"},{\"productName\":\"JUICE - BNJ-00027-00004\",\"vendorId\":\"27\",\"categoryId\":\"4\",\"featureId\":\"2\",\"productId\":\"5\",\"productImage\":\"2_2240x1680.png\"}]', 1),
(3, 3, '[{\"productName\":\"LAMP - BNJ-00027-000015\",\"vendorId\":\"27\",\"categoryId\":\"4\",\"featureId\":\"3\",\"productId\":\"16\",\"productImage\":\"nnamed_2240x1680.png\"},{\"productName\":\"STRIP - BNJ-00027-000016\",\"vendorId\":\"27\",\"categoryId\":\"4\",\"featureId\":\"3\",\"productId\":\"17\",\"productImage\":\"12_2240x1680.png\"},{\"productName\":\"DAIRY - BNJ-00027-000017\",\"vendorId\":\"27\",\"categoryId\":\"4\",\"featureId\":\"3\",\"productId\":\"18\",\"productImage\":\"images_2240x1680.png\"},{\"productName\":\"Flower - BNJ-00027-00003\",\"vendorId\":\"27\",\"categoryId\":\"4\",\"featureId\":\"3\",\"productId\":\"4\",\"productImage\":\"211405_2240x1680.png\"}]', 1),
(4, 4, '[{\"productName\":\"MEDICINE - BNJ-00027-00009\",\"vendorId\":\"27\",\"categoryId\":\"23\",\"featureId\":\"4\",\"productId\":\"10\",\"productImage\":\"13_2240x1680.png\"},{\"productName\":\"SALT BOTTLE - BNJ-00027-000014\",\"vendorId\":\"27\",\"categoryId\":\"23\",\"featureId\":\"4\",\"productId\":\"15\",\"productImage\":\"images1_2240x1680.png\"}]', 1),
(5, 7, '[{\"productName\":\"SHOWPICE - BNJ-00027-00005\",\"vendorId\":\"27\",\"categoryId\":\"23\",\"featureId\":\"7\",\"productId\":\"6\",\"productImage\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\"},{\"productName\":\"POTATOS - BNJ-00027-00006\",\"vendorId\":\"27\",\"categoryId\":\"23\",\"featureId\":\"7\",\"productId\":\"7\",\"productImage\":\"19016_2240x1680.png\"}]', 1),
(6, 5, '[{\"productName\":\"SALT BOTTLE - BNJ-00027-000014\",\"vendorId\":\"27\",\"categoryId\":\"23\",\"featureId\":\"5\",\"productId\":\"15\",\"productImage\":\"images1_2240x1680.png\"},{\"productName\":\"GUNS - BNJ-00027-00008\",\"vendorId\":\"27\",\"categoryId\":\"23\",\"featureId\":\"5\",\"productId\":\"9\",\"productImage\":\"30_2240x1680.png\"},{\"productName\":\"MEDICINE - BNJ-00027-00009\",\"vendorId\":\"27\",\"categoryId\":\"23\",\"featureId\":\"5\",\"productId\":\"10\",\"productImage\":\"13_2240x1680.png\"},{\"productName\":\"MOTORCYCLE - BNJ-00027-000012\",\"vendorId\":\"27\",\"categoryId\":\"23\",\"featureId\":\"5\",\"productId\":\"13\",\"productImage\":\"named1_2240x1680.png\"},{\"productName\":\"POTATOS - BNJ-00027-00006\",\"vendorId\":\"27\",\"categoryId\":\"23\",\"featureId\":\"5\",\"productId\":\"7\",\"productImage\":\"19016_2240x1680.png\"},{\"productName\":\"GUNS-1 - BNJ-00027-000010\",\"vendorId\":\"27\",\"categoryId\":\"23\",\"featureId\":\"5\",\"productId\":\"11\",\"productImage\":\"10_2240x1680.png\"},{\"productName\":\"Basket - BNJ-00027-00001\",\"vendorId\":\"27\",\"categoryId\":\"4\",\"featureId\":\"5\",\"productId\":\"1\",\"productImage\":\"5_2240x1680.png\"},{\"productName\":\"SUNGLASS - BNJ-00027-000018\",\"vendorId\":\"27\",\"categoryId\":\"4\",\"featureId\":\"5\",\"productId\":\"19\",\"productImage\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\"},{\"productName\":\"JUICE - BNJ-00027-00004\",\"vendorId\":\"27\",\"categoryId\":\"4\",\"featureId\":\"5\",\"productId\":\"5\",\"productImage\":\"2_2240x1680.png\"},{\"productName\":\"LAMP - BNJ-00027-000015\",\"vendorId\":\"27\",\"categoryId\":\"4\",\"featureId\":\"5\",\"productId\":\"16\",\"productImage\":\"nnamed_2240x1680.png\"},{\"productName\":\"STRIP - BNJ-00027-000016\",\"vendorId\":\"27\",\"categoryId\":\"4\",\"featureId\":\"5\",\"productId\":\"17\",\"productImage\":\"12_2240x1680.png\"},{\"productName\":\"DAIRY - BNJ-00027-000017\",\"vendorId\":\"27\",\"categoryId\":\"4\",\"featureId\":\"5\",\"productId\":\"18\",\"productImage\":\"images_2240x1680.png\"}]', 1),
(7, 6, '[{\"productName\":\"SHOWPICE - BNJ-00027-00005\",\"vendorId\":\"27\",\"categoryId\":\"23\",\"featureId\":\"6\",\"productId\":\"6\",\"productImage\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\"},{\"productName\":\"POTATOS - BNJ-00027-00006\",\"vendorId\":\"27\",\"categoryId\":\"23\",\"featureId\":\"6\",\"productId\":\"7\",\"productImage\":\"19016_2240x1680.png\"},{\"productName\":\"GUNS-1 - BNJ-00027-000010\",\"vendorId\":\"27\",\"categoryId\":\"23\",\"featureId\":\"6\",\"productId\":\"11\",\"productImage\":\"10_2240x1680.png\"},{\"productName\":\"MOTORCYCLE-1 - BNJ-00027-000013\",\"vendorId\":\"27\",\"categoryId\":\"23\",\"featureId\":\"6\",\"productId\":\"14\",\"productImage\":\"named_2240x1680.png\"},{\"productName\":\"Basket - BNJ-00027-00001\",\"vendorId\":\"27\",\"categoryId\":\"4\",\"featureId\":\"6\",\"productId\":\"1\",\"productImage\":\"5_2240x1680.png\"},{\"productName\":\"Flower - BNJ-00027-00003\",\"vendorId\":\"27\",\"categoryId\":\"4\",\"featureId\":\"6\",\"productId\":\"4\",\"productImage\":\"211405_2240x1680.png\"},{\"productName\":\"JUICE - BNJ-00027-00004\",\"vendorId\":\"27\",\"categoryId\":\"4\",\"featureId\":\"6\",\"productId\":\"5\",\"productImage\":\"2_2240x1680.png\"},{\"productName\":\"LAMP - BNJ-00027-000015\",\"vendorId\":\"27\",\"categoryId\":\"4\",\"featureId\":\"6\",\"productId\":\"16\",\"productImage\":\"nnamed_2240x1680.png\"},{\"productName\":\"DAIRY - BNJ-00027-000017\",\"vendorId\":\"27\",\"categoryId\":\"4\",\"featureId\":\"6\",\"productId\":\"18\",\"productImage\":\"images_2240x1680.png\"}]', 1);

-- --------------------------------------------------------

--
-- Table structure for table `feature_products_26122019`
--

CREATE TABLE `feature_products_26122019` (
  `id` int(11) NOT NULL,
  `feature_id` int(11) NOT NULL,
  `feature_products` text NOT NULL,
  `status` tinyint(2) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `feature_products_26122019`
--

INSERT INTO `feature_products_26122019` (`id`, `feature_id`, `feature_products`, `status`) VALUES
(9, 1, '[{\"productName\":\"Half shirt - BNJ-0000-00002\",\"vendorId\":\"1\",\"categoryId\":\"2\",\"featureId\":\"1\",\"productId\":\"5\"},{\"productName\":\"Tanin Chair - BNJ-0001-00005\",\"vendorId\":\"1\",\"categoryId\":\"18\",\"featureId\":\"1\",\"productId\":\"14\"},{\"productName\":\"RF Chair - BNJ-0001-00003\",\"vendorId\":\"1\",\"categoryId\":\"18\",\"featureId\":\"1\",\"productId\":\"15\"},{\"productName\":\"Jute Bag - BNJ-00017-00001\",\"vendorId\":\"17\",\"categoryId\":\"15\",\"featureId\":\"1\",\"productId\":\"37\",\"productImage\":\"Handloom-Jute-Bag-front-view.jpg\"},{\"productName\":\"Test Resels Product - BNJ-00021-00001\",\"vendorId\":\"21\",\"categoryId\":\"19\",\"featureId\":\"1\",\"productId\":\"42\",\"productImage\":\"lather_jacket_women.jpg\"}]', 1),
(11, 3, '[{\"productName\":\"Half shirt - BNJ-0000-00002\",\"vendorId\":\"1\",\"categoryId\":\"2\",\"featureId\":\"3\",\"productId\":\"5\"},{\"productName\":\"Test Banner 2 - BNJ-0002-000010\",\"vendorId\":\"2\",\"categoryId\":\"16\",\"featureId\":\"3\",\"productId\":\"27\",\"productImage\":\"testbanner2.png\"}]', 1),
(12, 4, '[{\"productName\":\"Test shirt 3 - BNJ-0002-00006\",\"vendorId\":\"2\",\"categoryId\":\"16\",\"featureId\":\"4\",\"productId\":\"23\"},{\"productName\":\"Test Shirt 4 - BNJ-0002-00007\",\"vendorId\":\"2\",\"categoryId\":\"16\",\"featureId\":\"4\",\"productId\":\"24\"},{\"productName\":\"Test Product 5 - BNJ-0002-00008\",\"vendorId\":\"2\",\"categoryId\":\"16\",\"featureId\":\"4\",\"productId\":\"25\"},{\"productName\":\"Test Banner - BNJ-0002-00009\",\"vendorId\":\"2\",\"categoryId\":\"16\",\"featureId\":\"4\",\"productId\":\"26\",\"productImage\":\"testbanner.png\"}]', 1),
(14, 7, '[{\"productName\":\"Half shirt - BNJ-0000-00002\",\"vendorId\":\"1\",\"categoryId\":\"2\",\"featureId\":\"7\",\"productId\":\"5\",\"productImage\":\"Half Shirt 01.jpg\"}]', 1),
(16, 6, '[{\"productName\":\"Half shirt - BNJ-0000-00002\",\"vendorId\":\"1\",\"categoryId\":\"2\",\"featureId\":\"6\",\"productId\":\"5\",\"productImage\":\"Half Shirt 01.jpg\"}]', 1),
(17, 8, '[{\"productName\":\"Half shirt - BNJ-0000-00002\",\"vendorId\":\"1\",\"categoryId\":\"2\",\"featureId\":\"8\",\"productId\":\"5\",\"productImage\":\"Half Shirt 01.jpg\"}]', 1),
(19, 2, '[{\"productName\":\"Half shirt - BNJ-0000-00002\",\"vendorId\":\"1\",\"categoryId\":\"2\",\"featureId\":\"2\",\"productId\":\"5\",\"productImage\":\"Half Shirt 01.jpg\"},{\"productName\":\"Mens Product - BNJ-0006-00003\",\"vendorId\":\"1\",\"categoryId\":\"2\",\"featureId\":\"2\",\"productId\":\"4\",\"productImage\":\"ppppp.jpg\"},{\"productName\":\"\",\"vendorId\":\"1\",\"categoryId\":\"2\",\"featureId\":\"2\",\"productId\":\"\",\"productImage\":\"ppppp.jpg\"}]', 1),
(20, 5, '[{\"productName\":\"Tanin Chair - BNJ-0001-00005\",\"vendorId\":\"1\",\"categoryId\":\"18\",\"featureId\":\"5\",\"productId\":\"14\",\"productImage\":\"bamboo-garden-chair-500x500.jpg\"},{\"productName\":\" - BNJ-0001-00004\",\"vendorId\":\"1\",\"categoryId\":\"16\",\"featureId\":\"5\",\"productId\":\"12\",\"productImage\":\"Shirt01.jpg\"}]', 1);

-- --------------------------------------------------------

--
-- Table structure for table `gnr_company`
--

CREATE TABLE `gnr_company` (
  `id` int(4) NOT NULL,
  `name` varchar(256) NOT NULL,
  `email` varchar(128) NOT NULL,
  `phone` varchar(11) NOT NULL,
  `telephone` varchar(32) NOT NULL,
  `address` text NOT NULL,
  `website` varchar(32) NOT NULL,
  `logo` text NOT NULL,
  `logo_mob` text NOT NULL,
  `qrcode` text NOT NULL,
  `createdDate` datetime NOT NULL,
  `updatedDate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `gnr_company`
--

INSERT INTO `gnr_company` (`id`, `name`, `email`, `phone`, `telephone`, `address`, `website`, `logo`, `logo_mob`, `qrcode`, `createdDate`, `updatedDate`, `status`) VALUES
(1, 'banijjo.com', '', '', '', '', 'banijjo.com', '', '', '', '2017-02-28 10:46:09', '2020-07-14 03:28:09', 0),
(2, 'banijjo.com.bd', '', '09677-222 2', '09677-222 222', '', 'https://www.banijjo.com.bd', 'banijjo.com.bd.png', 'banijjo-mobile-logo.png', 'qr_code_banijjo.png', '2020-07-12 16:13:58', '2020-07-16 03:09:33', 1);

-- --------------------------------------------------------

--
-- Table structure for table `inv_purchase`
--

CREATE TABLE `inv_purchase` (
  `id` int(11) NOT NULL,
  `billNo` varchar(28) NOT NULL,
  `orderNo` varchar(28) DEFAULT NULL,
  `chalanNo` varchar(255) NOT NULL,
  `storedby` int(5) NOT NULL,
  `supplierId` int(5) NOT NULL,
  `purchaseDate` date DEFAULT NULL,
  `totalQuantity` int(11) DEFAULT NULL,
  `totalAmount` double DEFAULT NULL,
  `paymentStatus` varchar(28) DEFAULT NULL,
  `isConfirmed` enum('false','true') NOT NULL,
  `createdBy` int(11) DEFAULT NULL,
  `createdDate` datetime NOT NULL,
  `updatedDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL DEFAULT 1,
  `softDel` tinyint(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `inv_purchase`
--

INSERT INTO `inv_purchase` (`id`, `billNo`, `orderNo`, `chalanNo`, `storedby`, `supplierId`, `purchaseDate`, `totalQuantity`, `totalAmount`, `paymentStatus`, `isConfirmed`, `createdBy`, `createdDate`, `updatedDate`, `status`, `softDel`) VALUES
(1, 'mehedi import export-1', NULL, 'mehedi-chalan-01', 71, 71, '2020-05-18', 5, 7500, NULL, 'false', NULL, '0000-00-00 00:00:00', '2020-05-18 06:49:29', 0, 1),
(2, 'mehedi import export-1', NULL, 'mehedi-chalan-01', 71, 71, '2020-05-18', 5, 7500, NULL, 'false', NULL, '0000-00-00 00:00:00', '2020-05-18 06:49:35', 0, 1),
(3, 'mehedi import export-1', NULL, 'mehedi-chalan-01', 71, 71, '2020-05-18', 5, 15000, NULL, 'false', NULL, '0000-00-00 00:00:00', '2020-05-18 07:27:09', 0, 1),
(4, 'mehedi import export-1', NULL, 'mehedi-chalan-01', 71, 71, '2020-05-18', 58, 307500, NULL, 'false', NULL, '0000-00-00 00:00:00', '2020-05-18 07:27:38', 0, 1),
(5, 'mehedi import export-1', NULL, 'mehedi-chalan-01', 71, 71, '2020-05-18', 5, 15000, NULL, 'false', NULL, '0000-00-00 00:00:00', '2020-05-18 07:29:40', 0, 1),
(6, 'mehedi import export-1', NULL, 'mehedi-chalan-01', 71, 71, '2020-05-18', 5, 15000, NULL, 'false', NULL, '0000-00-00 00:00:00', '2020-05-18 07:38:13', 0, 1),
(7, 'mehedi import export-1', NULL, 'mehedi-chalan-01', 71, 71, '2020-05-18', 5, 15000, NULL, 'false', NULL, '0000-00-00 00:00:00', '2020-05-18 07:39:04', 0, 1),
(8, 'mehedi import export-1', NULL, 'mehedi-chalan-01', 71, 71, '2020-05-18', 5, 15000, NULL, 'false', NULL, '0000-00-00 00:00:00', '2020-05-18 07:43:36', 0, 1),
(9, 'mehedi import export-1', NULL, 'mehedi-chalan-01', 71, 71, '2020-05-18', 5, 7500, NULL, 'true', NULL, '0000-00-00 00:00:00', '2020-05-18 07:46:34', 1, 1),
(10, 'mehedi import export-2', NULL, 'mehedi-chalan-02', 71, 71, '2020-05-18', 0, 0, NULL, 'false', NULL, '0000-00-00 00:00:00', '2020-05-18 08:34:41', 0, 1),
(11, 'mehedi import export-2', NULL, 'mehedi-chalan-02', 71, 71, '2020-05-18', 10, 40000, NULL, 'true', NULL, '0000-00-00 00:00:00', '2020-05-18 08:38:53', 1, 0),
(12, 'mehedi import export-3', NULL, 'mehedi-chalan-03', 71, 71, '2020-05-18', 10, 40000, NULL, 'true', NULL, '0000-00-00 00:00:00', '2020-05-18 08:42:31', 1, 0),
(13, 'mehedi import export-4', NULL, 'mehedi-chalan-04', 71, 71, '2020-05-18', 15, 57500, NULL, 'true', NULL, '0000-00-00 00:00:00', '2020-05-18 08:50:48', 1, 0),
(14, 'mehedi import export-5', NULL, 'mehedi-chalan-05', 71, 71, '2020-05-18', 30, 192500, NULL, 'true', NULL, '0000-00-00 00:00:00', '2020-05-18 08:53:57', 1, 0),
(15, 'mehedi import export-6', NULL, 'mehedi-chalan-06', 71, 71, '2020-05-18', 5, 7500, NULL, 'true', NULL, '0000-00-00 00:00:00', '2020-05-18 09:08:29', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `inv_purchase_details`
--

CREATE TABLE `inv_purchase_details` (
  `id` int(11) NOT NULL,
  `purchaseId` int(11) NOT NULL,
  `billNo` varchar(28) NOT NULL,
  `productId` int(11) NOT NULL,
  `colorId` int(11) DEFAULT 0,
  `sizeId` int(11) DEFAULT 0,
  `quantity` int(5) NOT NULL,
  `price` float NOT NULL,
  `totalPrice` double NOT NULL,
  `createdDate` datetime NOT NULL,
  `updatedDate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

--
-- Dumping data for table `inv_purchase_details`
--

INSERT INTO `inv_purchase_details` (`id`, `purchaseId`, `billNo`, `productId`, `colorId`, `sizeId`, `quantity`, `price`, `totalPrice`, `createdDate`, `updatedDate`, `status`) VALUES
(1, 8, 'mehedi import export-1', 67, NULL, NULL, 5, 3000, 15000, '0000-00-00 00:00:00', '2020-05-18 07:43:36', 1),
(2, 9, 'mehedi import export-1', 57, NULL, NULL, 5, 1500, 7500, '0000-00-00 00:00:00', '2020-05-18 07:46:34', 1),
(3, 11, 'mehedi import export-2', 66, NULL, NULL, 10, 4000, 40000, '0000-00-00 00:00:00', '2020-05-18 08:38:53', 1),
(4, 12, 'mehedi import export-3', 60, 4, 3, 10, 4000, 40000, '0000-00-00 00:00:00', '2020-05-18 08:42:31', 1),
(5, 13, 'mehedi import export-4', 58, 4, 6, 5, 3000, 15000, '0000-00-00 00:00:00', '2020-05-18 08:50:48', 1),
(6, 13, 'mehedi import export-4', 60, 0, 0, 5, 4500, 22500, '0000-00-00 00:00:00', '2020-05-18 08:50:48', 1),
(7, 13, 'mehedi import export-4', 61, 0, 0, 5, 4000, 20000, '0000-00-00 00:00:00', '2020-05-18 08:50:48', 1),
(8, 14, 'mehedi import export-5', 62, NULL, NULL, 5, 4000, 20000, '0000-00-00 00:00:00', '2020-05-18 08:53:57', 1),
(9, 14, 'mehedi import export-5', 63, 0, 0, 5, 7500, 37500, '0000-00-00 00:00:00', '2020-05-18 08:53:57', 1),
(10, 14, 'mehedi import export-5', 64, 0, 0, 5, 11000, 55000, '0000-00-00 00:00:00', '2020-05-18 08:53:57', 1),
(11, 14, 'mehedi import export-5', 65, 0, 0, 5, 9000, 45000, '0000-00-00 00:00:00', '2020-05-18 08:53:57', 1),
(12, 14, 'mehedi import export-5', 66, 0, 0, 5, 4000, 20000, '0000-00-00 00:00:00', '2020-05-18 08:53:57', 1),
(13, 14, 'mehedi import export-5', 67, 0, 0, 5, 3000, 15000, '0000-00-00 00:00:00', '2020-05-18 08:53:57', 1),
(14, 15, 'mehedi import export-6', 57, NULL, NULL, 5, 1500, 7500, '0000-00-00 00:00:00', '2020-05-18 09:08:29', 1);

-- --------------------------------------------------------

--
-- Table structure for table `inv_purchase_return`
--

CREATE TABLE `inv_purchase_return` (
  `id` int(11) NOT NULL,
  `purchaseReturnBillNo` varchar(28) NOT NULL,
  `purchaseBillNo` varchar(28) NOT NULL,
  `supplierId` int(5) NOT NULL,
  `purchaseDate` date NOT NULL,
  `purchaseReturnDate` datetime NOT NULL,
  `totalQuantity` int(11) NOT NULL,
  `totalAmount` double NOT NULL,
  `isConfirmed` enum('false','true') NOT NULL,
  `createdBy` varchar(28) NOT NULL,
  `createdDate` datetime NOT NULL,
  `updatedDate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `inv_purchase_return_details`
--

CREATE TABLE `inv_purchase_return_details` (
  `id` int(11) NOT NULL,
  `purchaseReturnId` int(11) NOT NULL,
  `purchaseReturnBillNo` varchar(28) NOT NULL,
  `purchaseBillNo` varchar(28) NOT NULL,
  `productId` int(11) NOT NULL,
  `colorId` int(11) DEFAULT NULL,
  `sizeId` int(11) DEFAULT NULL,
  `quantity` int(5) NOT NULL,
  `price` float NOT NULL,
  `totalPrice` double NOT NULL,
  `createdDate` datetime NOT NULL,
  `updatedDate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `order_amount` double NOT NULL,
  `billing_address` text NOT NULL,
  `shipping_address` text NOT NULL,
  `order_time` datetime NOT NULL,
  `courier_service_id` int(11) NOT NULL,
  `courier_order_code` varchar(100) NOT NULL,
  `status` enum('active','deactive') NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_discount` float DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `status` enum('active','deactive') NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `product_name` varchar(200) NOT NULL,
  `category_id` int(11) NOT NULL,
  `product_sku` text NOT NULL,
  `productPrice` double NOT NULL,
  `brand_name` varchar(255) NOT NULL,
  `product_specification_id` text DEFAULT NULL,
  `product_specification_name` text NOT NULL,
  `product_specification_details` text DEFAULT NULL,
  `product_specification_details_description` text NOT NULL,
  `product_full_description` text NOT NULL,
  `qc_status` enum('yes','no') NOT NULL,
  `image` text NOT NULL,
  `home_image` varchar(200) NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `entry_by` int(11) NOT NULL,
  `entry_user_type` varchar(255) DEFAULT NULL,
  `status` enum('active','deactive') NOT NULL,
  `isApprove` enum('authorize','unauthorize') NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_date` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `softDelete` tinyint(2) NOT NULL DEFAULT 0,
  `metaTags` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `slug`, `product_name`, `category_id`, `product_sku`, `productPrice`, `brand_name`, `product_specification_id`, `product_specification_name`, `product_specification_details`, `product_specification_details_description`, `product_full_description`, `qc_status`, `image`, `home_image`, `vendor_id`, `entry_by`, `entry_user_type`, `status`, `isApprove`, `created_date`, `updated_date`, `softDelete`, `metaTags`) VALUES
(1, 'basket-1', 'Basket', 4, 'BNJ-00027-00001', 500, 'RK,RK', NULL, '{}', NULL, '[]', '[{\"title\":\"Basket\",\"description\":\"Basket Room Cleaning\",\"descriptionImage\":\"5_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"12\"}]', '5_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 04:41:40', '2020-07-26 07:33:26', 0, '[\"Basket\",\"Cleaning Basket\"]'),
(3, 'basket-1-3', 'Basket-1', 4, 'BNJ-00027-00002', 500, 'FL,FL', NULL, '{}', NULL, '[]', '[{\"title\":\"Basket-1\",\"description\":\"Basket-1\",\"descriptionImage\":\"6_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"12\"}]', '6_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 05:31:09', '2020-07-26 07:33:26', 0, '[\"Basket-1\",\"Basket Cleaning\"]'),
(4, 'flower-4', 'Flower', 4, 'BNJ-00027-00003', 80, 'RL,RL', NULL, '{}', NULL, '[]', '[{\"title\":\"Flower\",\"description\":\"Flower\",\"descriptionImage\":\"211405_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"12\"}]', '211405_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 06:02:32', '2020-07-26 07:33:26', 0, '[\"Flower\"]'),
(5, 'juice-5', 'JUICE', 4, 'BNJ-00027-00004', 70, 'RL,RL', NULL, '{}', NULL, '[]', '[{\"title\":\"JUICE\",\"description\":\"JUICE\",\"descriptionImage\":\"2_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"12\"}]', '2_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 06:15:09', '2020-07-26 07:33:26', 0, '[\"JUICE\"]'),
(6, 'showpice-6', 'SHOWPICE', 23, 'BNJ-00027-00005', 400, 'RL,RL', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"7\"]}', NULL, '[]', '[{\"title\":\"SHOWPICE\",\"description\":\"SHOWPICE\",\"descriptionImage\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"12\"}]', '4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 06:24:21', '2020-07-26 07:33:26', 0, '[\"SHOWPICE\"]'),
(7, 'potatos-7', 'POTATOS', 23, 'BNJ-00027-00006', 150, 'RL,RL', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"7\"]}', NULL, '[]', '[{\"title\":\"POTATOS\",\"description\":\"POTATOS\",\"descriptionImage\":\"19016_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"12\"}]', '19016_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 06:28:20', '2020-07-26 07:33:26', 0, '[\"POTATOS\"]'),
(8, 'showpiece-8', 'SHOWPIECE', 23, 'BNJ-00027-00007', 700, 'RL,RL', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"7\"]}', NULL, '[{\"title\":\"SHOWPIECE\",\"description\":\"SHOWPIECE\",\"specification\":\"lorem ipsum\"}]', '[{\"title\":\"SHOWPIECE\",\"description\":\"SHOWPIECE\",\"descriptionImage\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"12\"}]', '8b48782bf796ec6febd963c0288bd78b_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 06:32:26', '2020-07-26 07:33:26', 0, '[\"SHOWPIECE\"]'),
(9, 'guns-9', 'GUNS', 23, 'BNJ-00027-00008', 599, 'RND,RND', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"7\"]}', NULL, '[]', '[{\"title\":\"GUNS\",\"description\":\"GUNS\",\"descriptionImage\":\"30_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"12\"}]', '30_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 06:38:25', '2020-07-26 07:33:26', 0, '[\"GUNS\"]'),
(10, 'medicine-10', 'MEDICINE', 23, 'BNJ-00027-00009', 400, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"MEDICINE\",\"description\":\"MEDICINE\",\"descriptionImage\":\"13_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"13_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"13_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"13_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"13_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"13_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"12\"}]', '13_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 06:42:10', '2020-07-26 07:33:26', 0, '[\"MEDICINE\"]'),
(11, 'guns-1-11', 'GUNS-1', 23, 'BNJ-00027-000010', 400, 'RND,RND', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"7\"]}', NULL, '[]', '[{\"title\":\"GUNS-1\",\"description\":\"GUNS-1\",\"descriptionImage\":\"10_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"10_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"10_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"10_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"10_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"10_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"12\"}]', '10_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 06:44:48', '2020-07-30 08:28:14', 1, '[\"GUNS-1\"]'),
(12, 'guns-2-12', 'GUNS-2', 23, 'BNJ-00027-000011', 599, 'RND,RND', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"GUNS-2\",\"description\":\"GUNS-2\",\"descriptionImage\":\"32_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"12\"}]', '32_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 06:47:15', '2020-07-26 07:33:26', 0, '[\"GUNS-2\"]'),
(13, 'motorcycle-13', 'MOTORCYCLE', 23, 'BNJ-00027-000012', 120999, 'HB', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"MOTORCYCLE\",\"description\":\"MOTORCYCLE\",\"descriptionImage\":\"named1_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"12\"}]', 'named1_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 06:57:58', '2020-07-26 07:33:26', 0, '[\"MOTORCYCLE\"]'),
(14, 'motorcycle-1-14', 'MOTORCYCLE-1', 23, 'BNJ-00027-000013', 119990, 'HB', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"MOTORCYCLE-1\",\"description\":\"MOTORCYCLE-1\",\"descriptionImage\":\"named_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"12\"}]', 'named_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 07:02:16', '2020-07-26 07:33:26', 0, '[\"MOTORCYCLE-1\"]'),
(15, 'salt-bottle-15', 'SALT BOTTLE', 23, 'BNJ-00027-000014', 60, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"3\"]}', NULL, '[]', '[{\"title\":\"SALT BOTTLE\",\"description\":\"SALT BOTTLE\",\"descriptionImage\":\"images1_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"12\"}]', 'images1_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 07:05:34', '2020-07-26 07:33:26', 0, '[\"SALT BOTTLE\"]'),
(16, 'lamp-16', 'LAMP', 4, 'BNJ-00027-000015', 400, 'DLP,DLP', NULL, '{}', NULL, '[]', '[{\"title\":\"LAMP\",\"description\":\"LAMP\",\"descriptionImage\":\"nnamed_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"12\"}]', 'nnamed_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 07:16:16', '2020-07-26 07:33:26', 0, '[\"LAMP\"]'),
(17, 'strip-17', 'STRIP', 4, 'BNJ-00027-000016', 35, 'RL,RL', NULL, '{}', NULL, '[]', '[{\"title\":\"STRIP\",\"description\":\"STRIP\",\"descriptionImage\":\"12_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"12_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"11_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"12_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"11_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"12_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"11_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"12_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"11_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"12_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"11_2240x1680.png\",\"serialNumber\":\"12\"}]', '12_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 07:21:24', '2020-07-26 07:33:26', 0, '[]'),
(18, 'dairy-18', 'DAIRY', 4, 'BNJ-00027-000017', 100, 'RL,RL', NULL, '{}', NULL, '[]', '[{\"title\":\"DAIRY\",\"description\":\"DAIRY\",\"descriptionImage\":\"images_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"12\"}]', 'images_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 07:25:22', '2020-07-26 07:33:26', 0, '[\"DAIRY\"]'),
(19, 'sunglass-19', 'SUNGLASS', 4, 'BNJ-00027-000018', 250, 'LR,LR', NULL, '{}', NULL, '[]', '[{\"title\":\"SUNGLASS\",\"description\":\"SUNGLASS\",\"descriptionImage\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"12\"}]', 'wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 07:28:20', '2020-07-26 07:33:26', 0, '[\"SUNGLASS\"]'),
(20, 'belt-20', 'BELT', 4, 'BNJ-00027-000019', 300, 'LOGO,LOGO', NULL, '{}', NULL, '[]', '[{\"title\":\"BELT\",\"description\":\"BELT\",\"descriptionImage\":\"unnamed_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"12\"}]', 'unnamed_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 07:32:13', '2020-07-26 07:33:26', 0, '[\"BELT\"]'),
(21, 'showpiece-2-21', 'SHOWPIECE-2', 4, 'BNJ-00027-000020', 150, 'RL,RL', NULL, '{}', NULL, '[]', '[{\"title\":\"SHOWPIECE-2\",\"description\":\"SHOWPIECE-2\",\"descriptionImage\":\"IMG_8647-2240x1680_2240x1680.jpeg\"}]', 'yes', '[{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"12\"}]', 'IMG_8647-2240x1680_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 07:34:37', '2020-07-26 07:33:26', 0, '[\"SHOWPIECE-2\"]'),
(22, 'history-book-22', 'HISTORY BOOK', 4, 'BNJ-00027-000021', 599, 'LR,LR', NULL, '{}', NULL, '[]', '[{\"title\":\"HISTORY BOOK\",\"description\":\"HISTORY BOOK\",\"descriptionImage\":\"hRp38qO_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"12\"}]', 'hRp38qO_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 07:37:11', '2020-07-26 07:33:26', 0, '[\"HISTORY BOOK\"]'),
(23, 'camera-23', 'CAMERA', 4, 'BNJ-00027-000022', 71500, 'CANON,CANON', NULL, '{}', NULL, '[]', '[{\"title\":\"CAMERA\",\"description\":\"CAMERA\",\"descriptionImage\":\"29_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"12\"}]', '29_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 07:40:43', '2020-07-26 07:33:26', 0, '[\"CAMERA\"]'),
(24, 'plastic-rag-24', 'PLASTIC RAG', 4, 'BNJ-00027-000023', 150, 'RFL,RFL', NULL, '{}', NULL, '[]', '[{\"title\":\"PLASTIC RAG\",\"description\":\"PLASTIC RAG\",\"descriptionImage\":\"11_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"11_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"12_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"11_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"12_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"11_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"12_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"11_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"12_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"11_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"12_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"11_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"12_2240x1680.png\",\"serialNumber\":\"12\"}]', '11_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 07:45:07', '2020-07-26 07:33:26', 0, '[\"PLASTIC RAG\"]'),
(25, 'painting-25', 'PAINTING', 4, 'BNJ-00027-000024', 700, 'LR,LR', NULL, '{}', NULL, '[]', '[{\"title\":\"PAINTING\",\"description\":\"PAINTING\",\"descriptionImage\":\"cocker-spaniel-drawing-62.jpg\"}]', 'yes', '[{\"imageName\":\"cocker-spaniel-drawing-62.png\",\"serialNumber\":\"3\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b.png\",\"serialNumber\":\"4\"},{\"imageName\":\"cocker-spaniel-drawing-62.png\",\"serialNumber\":\"5\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b.png\",\"serialNumber\":\"6\"},{\"imageName\":\"cocker-spaniel-drawing-62.png\",\"serialNumber\":\"7\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b.png\",\"serialNumber\":\"8\"},{\"imageName\":\"cocker-spaniel-drawing-62.png\",\"serialNumber\":\"9\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b.png\",\"serialNumber\":\"10\"},{\"imageName\":\"cocker-spaniel-drawing-62.png\",\"serialNumber\":\"11\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b.png\",\"serialNumber\":\"12\"}]', 'cocker-spaniel-drawing-62.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 07:54:52', '2020-07-26 07:33:26', 0, '[\"PAINTING\"]'),
(26, 'device-26', 'DEVICE', 4, 'BNJ-00027-000025', 1300, 'RL,RL', NULL, '{}', NULL, '[]', '[{\"title\":\"DEVICE\",\"description\":\"DEVICE\",\"descriptionImage\":\"20_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"20_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"20_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"20_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"20_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"20_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"12\"}]', '20_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 08:00:40', '2020-07-26 07:33:26', 0, '[]'),
(27, 'laptop-27', 'LAPTOP', 4, 'BNJ-00027-000026', 40000, 'LG,LG', NULL, '{}', NULL, '[]', '[{\"title\":\"LAPTOP\",\"description\":\"LAPTOP\",\"descriptionImage\":\"15_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"15_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"17_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"15_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"17_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"15_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"17_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"15_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"17_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"15_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"17_2240x1680.png\",\"serialNumber\":\"12\"}]', '15_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 08:37:57', '2020-07-26 07:33:26', 0, '[\"LAPTOP\"]'),
(28, 'device-1-28', 'DEVICE-1', 4, 'BNJ-00027-000027', 1500, 'LR,LR', NULL, '{}', NULL, '[]', '[{\"title\":\"LAPTOP\",\"description\":\"LAPTOP\",\"descriptionImage\":\"17_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"17_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"15_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"17_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"15_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"17_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"15_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"17_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"15_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"17_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"15_2240x1680.png\",\"serialNumber\":\"12\"}]', '17_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 08:42:05', '2020-07-26 07:33:26', 0, '[\"LAPTOP\"]'),
(29, 'pin-29', 'PIN', 4, 'BNJ-00027-000028', 100, 'RL', NULL, '{\"color\":[],\"size\":[]}', NULL, '[]', '[{\"title\":\"PIN\",\"description\":\"PIN\",\"descriptionImage\":\"wessex-ellard-canopy-roller-spindles-250-2240x1680_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"wessex-ellard-canopy-roller-spindles-250-2240x1680_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"wessex-ellard-canopy-roller-spindles-250-2240x1680_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"wessex-ellard-canopy-roller-spindles-250-2240x1680_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"wessex-ellard-canopy-roller-spindles-250-2240x1680_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"wessex-ellard-canopy-roller-spindles-250-2240x1680_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"12\"}]', 'wessex-ellard-canopy-roller-spindles-250-2240x1680_2240x1680.png', 27, 0, NULL, 'active', 'unauthorize', '2020-02-27 08:50:51', '2020-07-26 07:33:26', 0, '[]'),
(30, 'showpiece-3-30', 'SHOWPIECE-3', 4, 'BNJ-00027-000029', 180, 'LR,LR', NULL, '{}', NULL, '[]', '[{\"title\":\"SHOWPIECE-3\",\"description\":\"SHOWPIECE-3\",\"descriptionImage\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"cocker-spaniel-drawing-62_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"cocker-spaniel-drawing-62_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"cocker-spaniel-drawing-62_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"cocker-spaniel-drawing-62_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"cocker-spaniel-drawing-62_2240x1680.png\",\"serialNumber\":\"12\"}]', 'goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 08:56:23', '2020-07-26 07:33:26', 0, '[\"SHOWPIECE-3\"]'),
(31, 'book-31', 'BOOK', 4, 'BNJ-00027-000030', 220, 'LR,LR', NULL, '{}', NULL, '[]', '[{\"title\":\"BOOK\",\"description\":\"BOOK\",\"descriptionImage\":\"27.JPG\"}]', 'yes', '[{\"imageName\":\"27.png\",\"serialNumber\":\"3\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"12\"}]', '27_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 09:09:37', '2020-07-26 07:33:26', 0, '[\"BOOK\"]'),
(32, 'painting-1-32', 'PAINTING-1', 4, 'BNJ-00027-000031', 300, 'LR LR', NULL, '{\"color\":[],\"size\":[]}', NULL, '[]', '[{\"title\":\"PAINTING-1\",\"description\":\"PAINTING-1\",\"descriptionImage\":\"1553301087397.jpg\"}]', 'yes', '[{\"imageName\":\"birds_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"17_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"cocker-spaniel-drawing-62_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"cocker-spaniel-drawing-62_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"cocker-spaniel-drawing-62_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"cocker-spaniel-drawing-62_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"cocker-spaniel-drawing-62_2240x1680.png\",\"serialNumber\":\"12\"}]', 'birds_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 09:22:25', '2020-07-26 07:33:26', 0, '[\"PAINTING-1\"]'),
(33, 'flower-33', 'FLOWER', 16, 'BNJ-00027-000032', 100, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"2\"]}', NULL, '[]', '[{\"title\":\"FLOWER\",\"description\":\"FLOWER\",\"descriptionImage\":\"211405_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"12\"}]', '211405_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 06:58:06', '2020-07-26 07:33:26', 0, '[\"FLOWER\"]'),
(34, 'juice-34', 'JUICE', 16, 'BNJ-00027-000033', 70, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"JUICE\",\"description\":\"JUICE\",\"descriptionImage\":\"2_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"12\"}]', '2_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 07:02:59', '2020-07-26 07:33:26', 0, '[\"JUICE\"]'),
(35, 'showpiece-35', 'SHOWPIECE', 16, 'BNJ-00027-000034', 2600, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"SHOWPIECE\",\"description\":\"SHOWPIECE\",\"descriptionImage\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"12\"}]', '8b48782bf796ec6febd963c0288bd78b_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 07:31:16', '2020-07-26 07:33:26', 0, '[\"SHOWPIECE\"]'),
(36, 'showpiece-1-36', 'SHOWPIECE-1', 16, 'BNJ-00027-000035', 600, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"SHOWPIECE-1\",\"description\":\"SHOWPIECE-1\",\"descriptionImage\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"12\"}]', '4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 07:34:44', '2020-07-26 07:33:26', 0, '[\"SHOWPIECE-1\"]'),
(37, 'showpiece-3-37', 'SHOWPIECE-3', 16, 'BNJ-00027-000036', 1200, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"SHOWPIECE-3\",\"description\":\"SHOWPIECE-3\",\"descriptionImage\":\"1553301087397_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"12\"}]', '1553301087397_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 07:44:44', '2020-07-26 07:33:26', 0, '[\"SHOWPIECE-3\"]'),
(38, 'showpiece-4-38', 'SHOWPIECE-4', 16, 'BNJ-00027-000037', 300, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"SHOWPIECE-4\",\"description\":\"SHOWPIECE-4\",\"descriptionImage\":\"IMG_8647-2240x1680_2240x1680.jpeg\"}]', 'yes', '[{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"12\"}]', 'IMG_8647-2240x1680_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 07:53:00', '2020-07-26 07:33:26', 0, '[\"SHOWPIECE-4\"]'),
(39, 'camera-39', 'CAMERA', 16, 'BNJ-00027-000038', 44995, 'CANON,CANON', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"CAMERA\",\"description\":\"CAMERA\",\"descriptionImage\":\"29_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"12\"}]', '29_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 07:56:11', '2020-07-26 07:33:26', 0, '[\"CAMERA\"]'),
(40, 'showpiece-2-40', 'SHOWPIECE-2', 16, 'BNJ-00027-000039', 400, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"SHOWPIECE-2\",\"description\":\"SHOWPIECE-2\",\"descriptionImage\":\"19016_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"12\"}]', '19016_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 08:23:35', '2020-07-26 07:33:26', 0, '[\"SHOWPIECE-2\"]'),
(41, 'history-book-41', 'HISTORY BOOK', 16, 'BNJ-00027-000040', 400, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"HISTORY BOOK\",\"description\":\"HISTORY BOOK\",\"descriptionImage\":\"hRp38qO_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"12\"}]', 'hRp38qO_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 08:37:09', '2020-07-26 07:33:26', 0, '[\"HISTORY BOOK\"]'),
(42, 'book-42', 'BOOK', 16, 'BNJ-00027-000041', 400, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"BOOK\",\"description\":\"BOOK\",\"descriptionImage\":\"27_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"12\"}]', '27_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 08:39:41', '2020-07-26 07:33:26', 0, '[\"BOOK\"]'),
(43, 'lamps-43', 'LAMPS', 23, 'BNJ-00027-000042', 700, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"LAMPS\",\"description\":\"LAMPS\",\"descriptionImage\":\"nnamed_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"12\"}]', 'nnamed_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 08:43:20', '2020-07-26 07:33:26', 0, '[\"LAMPS\"]'),
(44, 'paper-44', 'PAPER', 23, 'BNJ-00027-000043', 40, 'RL,RL', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"PAPER\",\"description\":\"PAPER\",\"descriptionImage\":\"images_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"12\"}]', 'images_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 08:45:34', '2020-07-26 07:33:26', 0, '[\"PAPER\"]'),
(45, 'bottle-45', 'BOTTLE', 23, 'BNJ-00027-000044', 70, 'RL,RL', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"BOTTLE\",\"description\":\"BOTTLE\",\"descriptionImage\":\"images1_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"12\"}]', 'images1_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 08:47:34', '2020-07-26 07:33:26', 0, '[\"BOTTLE\"]');
INSERT INTO `products` (`id`, `slug`, `product_name`, `category_id`, `product_sku`, `productPrice`, `brand_name`, `product_specification_id`, `product_specification_name`, `product_specification_details`, `product_specification_details_description`, `product_full_description`, `qc_status`, `image`, `home_image`, `vendor_id`, `entry_by`, `entry_user_type`, `status`, `isApprove`, `created_date`, `updated_date`, `softDelete`, `metaTags`) VALUES
(46, 'bike-46', 'BIKE', 23, 'BNJ-00027-000045', 11990, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"BIKE\",\"description\":\"BIKE\",\"descriptionImage\":\"named_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"12\"}]', 'named_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 08:50:32', '2020-07-26 07:33:26', 0, '[\"BIKE\"]'),
(47, 'sunglass-47', 'SUNGLASS', 23, 'BNJ-00027-000046', 250, 'RL,RL', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"SUNGLASS\",\"description\":\"SUNGLASS\",\"descriptionImage\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"12\"}]', 'wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 08:52:39', '2020-07-26 07:33:26', 0, '[\"SUNGLASS\"]'),
(48, 'belt-48', 'BELT', 23, 'BNJ-00027-000047', 599, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"BELT\",\"description\":\"BELT\",\"descriptionImage\":\"unnamed_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"12\"}]', 'unnamed_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 08:54:41', '2020-07-26 07:33:26', 0, '[\"BELT\"]'),
(49, 'bike-2-49', 'BIKE-2', 23, 'BNJ-00027-000048', 11990, 'RL,RL', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"BIKE-2\",\"description\":\"BIKE-2\",\"descriptionImage\":\"named1_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"12\"}]', 'named1_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 08:59:44', '2020-07-26 07:33:26', 0, '[\"BIKE-2\"]'),
(50, 'guns-1-50', 'GUNS-1', 23, 'BNJ-00027-000049', 1100, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"GUNS-1\",\"description\":\"GUNS-1\",\"descriptionImage\":\"10_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"10_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"10_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"10_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"10_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"10_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"12\"}]', '10_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 09:06:19', '2020-07-26 07:33:26', 0, '[\"GUNS-1\"]'),
(51, 'guns-2-51', 'GUNS-2', 23, 'BNJ-00027-000050', 1200, 'RL,RL', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"GUNS-2\",\"description\":\"GUNS-2\",\"descriptionImage\":\"32_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"12\"}]', '32_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 09:10:07', '2020-07-26 07:33:26', 0, '[\"GUNS-2\"]'),
(52, 'basket-1-52', 'BASKET-1', 23, 'BNJ-00027-000051', 500, 'RL,RL', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"BASKET-1\",\"description\":\"BASKET-1\",\"descriptionImage\":\"5_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"12\"}]', '5_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 09:13:16', '2020-07-26 07:33:26', 0, '[\"BASKET-1\"]'),
(53, 'full-shirt-53', 'Full Shirt', 24, 'BNJ-00033-00001', 1200, 'Test,Test', NULL, '{}', NULL, '[]', '[{\"title\":\"Full Shirt Description\",\"description\":\"\",\"descriptionImage\":\"41TOGKhEIJL.jpg\"}]', 'yes', '[{\"imageName\":\"1_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"41TxNIo3cQL_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"1_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"41TxNIo3cQL_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"1_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"41TxNIo3cQL_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"1_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"41TxNIo3cQL_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"1_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"41TxNIo3cQL_2240x1680.png\",\"serialNumber\":\"12\"}]', '1_2240x1680.png', 33, 0, NULL, 'active', 'authorize', '2020-04-02 11:34:59', '2020-07-26 07:33:26', 0, '[]'),
(54, 'full-shirt-02-54', 'Full Shirt 02', 24, 'BNJ-00033-00002', 1200, 'Test,Test', NULL, '{}', NULL, '[]', '[{\"title\":\"Hello\",\"description\":\"\",\"descriptionImage\":\"Men-T-Shirt-Full-Sleeve-Size-Chart.jpg\"}]', 'yes', '[{\"imageName\":\"full-sleeve-shirt-03-aponzone-600x540_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"Liseaven-T-Shirt-Men-Cotton-T-Shirt-Full-Sleeve-tshirt-Men-Solid-Color-T-shirts-tops.jpg_640x640_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"full-sleeve-shirt-03-aponzone-600x540_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"Liseaven-T-Shirt-Men-Cotton-T-Shirt-Full-Sleeve-tshirt-Men-Solid-Color-T-shirts-tops.jpg_640x640_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"full-sleeve-shirt-03-aponzone-600x540_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"Liseaven-T-Shirt-Men-Cotton-T-Shirt-Full-Sleeve-tshirt-Men-Solid-Color-T-shirts-tops.jpg_640x640_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"full-sleeve-shirt-03-aponzone-600x540_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"Liseaven-T-Shirt-Men-Cotton-T-Shirt-Full-Sleeve-tshirt-Men-Solid-Color-T-shirts-tops.jpg_640x640_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"full-sleeve-shirt-03-aponzone-600x540_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"Liseaven-T-Shirt-Men-Cotton-T-Shirt-Full-Sleeve-tshirt-Men-Solid-Color-T-shirts-tops.jpg_640x640_2240x1680.png\",\"serialNumber\":\"12\"}]', 'full-sleeve-shirt-03-aponzone-600x540_2240x1680.png', 33, 0, NULL, 'active', 'authorize', '2020-04-02 11:36:51', '2020-07-26 07:33:26', 0, '[\"Full Shirt\"]'),
(55, 'half-pant-01-55', 'Half Pant 01', 25, 'BNJ-00033-00003', 500, 'Test Pant,Test Pant', NULL, '{}', NULL, '[]', '[{\"title\":\"Test\",\"description\":\"\",\"descriptionImage\":\"Half Waist (cm).jpg\"}]', 'yes', '[{\"imageName\":\"hp74_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"mens-half-pant-500x500_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"hp74_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"mens-half-pant-500x500_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"hp74_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"mens-half-pant-500x500_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"hp74_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"mens-half-pant-500x500_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"hp74_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"mens-half-pant-500x500_2240x1680.png\",\"serialNumber\":\"12\"}]', 'hp74_2240x1680.png', 33, 0, NULL, 'active', 'authorize', '2020-04-02 11:38:53', '2020-07-26 07:33:26', 0, '[\"Half Pant\"]'),
(56, 'half-pant-02-56', 'Half Pant 02', 25, 'BNJ-00033-00004', 600, 'Tets Pant,Tets Pant', NULL, '{}', NULL, '[]', '[{\"title\":\"Test Pant\",\"description\":\"\",\"descriptionImage\":\"Sizing_chart_Half_pant.jfif\"}]', 'yes', '[{\"imageName\":\"mens-half-pant-500x500_1_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"men-s-half-pant-500x500_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"mens-half-pant-500x500_1_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"men-s-half-pant-500x500_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"mens-half-pant-500x500_1_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"men-s-half-pant-500x500_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"mens-half-pant-500x500_1_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"men-s-half-pant-500x500_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"mens-half-pant-500x500_1_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"men-s-half-pant-500x500_2240x1680.png\",\"serialNumber\":\"12\"}]', 'mens-half-pant-500x500_1_2240x1680.png', 33, 0, NULL, 'active', 'unauthorize', '2020-04-02 11:40:42', '2020-07-26 07:33:26', 0, '[\"Half Pant\"]'),
(57, 'handi-craft-mehedi-001-57', 'handi-craft-mehedi-001', 4, 'BNJ-00071-00001', 2000, 'mehedi,mehedi', NULL, '{}', NULL, '[]', '[]', 'yes', '[{\"imageName\":\"handi-craft-mehedi-01.png\",\"serialNumber\":\"3\"},{\"imageName\":\"handi-craft-mehedi-02.png\",\"serialNumber\":\"4\"},{\"imageName\":\"handi-craft-mehedi-03.png\",\"serialNumber\":\"5\"},{\"imageName\":\"handi-craft-mehedi-04.png\",\"serialNumber\":\"6\"},{\"imageName\":\"handi-craft-mehedi-05.png\",\"serialNumber\":\"7\"}]', 'handi-craft-mehedi-01.png', 71, 0, NULL, 'active', 'authorize', '2020-05-18 04:48:26', '2020-07-26 07:33:26', 0, '[]'),
(58, 'full-pant-mehedi-001-58', 'full-pant-mehedi-001', 23, 'BNJ-00071-00002', 3500, 'undefined', NULL, '{\"color\":[{\"colorId\":\"4\",\"imageName\":\"\"},{\"colorId\":\"5\",\"imageName\":\"\"},{\"colorId\":\"7\",\"imageName\":\"\"}],\"size\":[\"6\",\"7\"]}', NULL, '[]', '[{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"men-full-pant-mehedi-001.png\",\"serialNumber\":\"3\"},{\"imageName\":\"men-full-pant-mehedi-002.png\",\"serialNumber\":\"4\"},{\"imageName\":\"men-full-pant-mehedi-003.png\",\"serialNumber\":\"5\"},{\"imageName\":\"men-full-pant-mehedi-004.png\",\"serialNumber\":\"6\"},{\"imageName\":\"men-full-pant-mehedi-005.png\",\"serialNumber\":\"7\"}]', 'men-full-pant-mehedi-001.png', 71, 0, NULL, 'active', 'authorize', '2020-05-18 04:57:44', '2020-07-26 07:33:26', 0, '[]'),
(59, '-59', '', 0, '', 0, 'undefined', NULL, '{}', NULL, '[]', '[{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"men-full-shirt-mehedi-001.png\",\"serialNumber\":\"3\"},{\"imageName\":\"men-full-shirt-mehedi-003.png\",\"serialNumber\":\"4\"},{\"imageName\":\"men-full-shirt-mehedi-005.png\",\"serialNumber\":\"5\"},{\"imageName\":\"men-full-shirt-mehedi-004.png\",\"serialNumber\":\"6\"}]', 'men-full-shirt-mehedi-001.png', 71, 0, NULL, 'active', 'unauthorize', '2020-05-18 05:12:03', '2020-07-26 07:33:26', 0, '[]'),
(60, 'women-dress-mehedi-01-60', 'women-dress-mehedi-01', 16, 'BNJ-00071-00004', 5000, 'undefined', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"green-color.jpg\"},{\"colorId\":5,\"imageName\":\"red-color.jpg\"},{\"colorId\":7,\"imageName\":\"blue-color.jpg\"}],\"size\":[\"3\",\"6\",\"7\"]}', NULL, '[]', '[{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"women-mehedi-001-01.png\",\"serialNumber\":\"3\"},{\"imageName\":\"women-mehedi-001-02.png\",\"serialNumber\":\"4\"},{\"imageName\":\"women-mehedi-001-03.png\",\"serialNumber\":\"5\"},{\"imageName\":\"women-mehedi-001-04.png\",\"serialNumber\":\"6\"},{\"imageName\":\"women-mehedi-001-05.png\",\"serialNumber\":\"7\"}]', 'women-mehedi-001-01.png', 71, 0, NULL, 'active', 'authorize', '2020-05-18 05:41:12', '2020-07-26 07:33:26', 0, '[]'),
(61, 'women-dress-mehedi-02-61', 'women-dress-mehedi-02', 6, 'BNJ-00071-00005', 4500, 'undefined', NULL, '{}', NULL, '[]', '[{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"women-mehedi-002-01.png\",\"serialNumber\":\"3\"},{\"imageName\":\"women-mehedi-002-02.png\",\"serialNumber\":\"4\"},{\"imageName\":\"women-mehedi-002-03.png\",\"serialNumber\":\"5\"},{\"imageName\":\"women-mehedi-002-04.png\",\"serialNumber\":\"6\"},{\"imageName\":\"women-mehedi-002-05.png\",\"serialNumber\":\"7\"}]', 'women-mehedi-002-01.png', 71, 0, NULL, 'active', 'authorize', '2020-05-18 05:45:36', '2020-07-26 07:33:26', 0, '[]'),
(62, 'women-dress-mehedi-03-62', 'women-dress-mehedi-03', 6, 'BNJ-00071-00006', 4800, 'undefined', NULL, '{}', NULL, '[]', '[{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"women-mehedi-003-01.png\",\"serialNumber\":\"3\"},{\"imageName\":\"women-mehedi-003-02.png\",\"serialNumber\":\"4\"},{\"imageName\":\"women-mehedi-003-03.png\",\"serialNumber\":\"5\"},{\"imageName\":\"women-mehedi-003-04.png\",\"serialNumber\":\"6\"},{\"imageName\":\"women-mehedi-003-05.png\",\"serialNumber\":\"7\"}]', 'women-mehedi-003-01.png', 71, 0, NULL, 'active', 'authorize', '2020-05-18 05:49:37', '2020-07-26 07:33:26', 0, '[]'),
(63, 'ladies-bags-mehedi-001-63', 'ladies-bags-mehedi-001', 5, 'BNJ-00071-00007', 7800, 'undefined', NULL, '{}', NULL, '[]', '[{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"leather-products-mehedi-001-01.png\",\"serialNumber\":\"3\"},{\"imageName\":\"leather-products-mehedi-001-04.png\",\"serialNumber\":\"6\"},{\"imageName\":\"leather-products-mehedi-001-05.png\",\"serialNumber\":\"7\"},{\"imageName\":\"leather-products-mehedi-001-02.png\",\"serialNumber\":\"4\"},{\"imageName\":\"leather-products-mehedi-001-03.png\",\"serialNumber\":\"5\"}]', 'leather-products-mehedi-001-01.png', 71, 0, NULL, 'active', 'authorize', '2020-05-18 05:56:35', '2020-07-26 07:33:26', 0, '[]'),
(64, 'leather-shoes-men-mehedi-01-64', 'leather-shoes-men-mehedi-01', 5, 'BNJ-00071-00008', 12000, 'undefined', NULL, '{}', NULL, '[]', '[{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"leather-shoes-mehedi-001-01.png\",\"serialNumber\":\"3\"},{\"imageName\":\"leather-shoes-mehedi-001-02.png\",\"serialNumber\":\"4\"},{\"imageName\":\"leather-shoes-mehedi-001-03.png\",\"serialNumber\":\"5\"},{\"imageName\":\"leather-shoes-mehedi-001-04.png\",\"serialNumber\":\"6\"},{\"imageName\":\"leather-shoes-mehedi-001-05.png\",\"serialNumber\":\"7\"}]', 'leather-shoes-mehedi-001-01.png', 71, 0, NULL, 'active', 'authorize', '2020-05-18 06:00:39', '2020-07-26 07:33:26', 0, '[]'),
(65, 'leather-shoes-men-mehedi-02-65', 'leather-shoes-men-mehedi-02', 5, 'BNJ-00071-00009', 10000, 'undefined', NULL, '{}', NULL, '[]', '[{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"leather-shoes-mehedi-002-01.png\",\"serialNumber\":\"3\"},{\"imageName\":\"leather-shoes-mehedi-002-02.png\",\"serialNumber\":\"4\"},{\"imageName\":\"leather-shoes-mehedi-002-03.png\",\"serialNumber\":\"5\"},{\"imageName\":\"leather-shoes-mehedi-002-04.png\",\"serialNumber\":\"6\"},{\"imageName\":\"leather-shoes-mehedi-002-05.png\",\"serialNumber\":\"7\"}]', 'leather-shoes-mehedi-002-01.png', 71, 0, NULL, 'active', 'authorize', '2020-05-18 06:04:02', '2020-07-26 07:33:26', 0, '[]'),
(66, 'kids-dress-mehedi-001-66', 'Kids Dress Mehedi 001', 7, 'BNJ-00071-000010', 4500, 'undefined', NULL, '{}', NULL, '[]', '[{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"kids-dress-mehedi-001-01.png\",\"serialNumber\":\"3\"},{\"imageName\":\"kids-dress-mehedi-001-02.png\",\"serialNumber\":\"4\"},{\"imageName\":\"kids-dress-mehedi-001-03.png\",\"serialNumber\":\"5\"},{\"imageName\":\"kids-dress-mehedi-001-04.png\",\"serialNumber\":\"6\"},{\"imageName\":\"kids-dress-mehedi-001-05.png\",\"serialNumber\":\"7\"}]', 'kids-dress-mehedi-001-01.png', 71, 0, NULL, 'active', 'authorize', '2020-05-18 06:08:12', '2020-07-26 07:33:26', 0, '[]'),
(67, 'full-shirt-men-mehedi-01-67', 'Full Shirt Men Mehedi 01', 24, 'BNJ-00071-000011', 3500, 'undefined', NULL, '{}', NULL, '[]', '[{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"men-full-shirt-mehedi-001.png\",\"serialNumber\":\"3\"},{\"imageName\":\"men-full-shirt-mehedi-003.png\",\"serialNumber\":\"5\"},{\"imageName\":\"men-full-shirt-mehedi-004.png\",\"serialNumber\":\"6\"},{\"imageName\":\"men-full-shirt-mehedi-005.png\",\"serialNumber\":\"7\"}]', 'men-full-shirt-mehedi-001.png', 71, 0, NULL, 'active', 'authorize', '2020-05-18 06:18:32', '2020-07-26 07:33:26', 0, '[]');

-- --------------------------------------------------------

--
-- Table structure for table `products_26122019`
--

CREATE TABLE `products_26122019` (
  `id` int(11) NOT NULL,
  `product_name` varchar(200) NOT NULL,
  `category_id` int(11) NOT NULL,
  `product_sku` text NOT NULL,
  `productPrice` double NOT NULL,
  `brand_name` varchar(255) NOT NULL,
  `product_specification_id` text DEFAULT NULL,
  `product_specification_name` text NOT NULL,
  `product_specification_details` text DEFAULT NULL,
  `product_specification_details_description` text NOT NULL,
  `product_full_description` text NOT NULL,
  `qc_status` enum('yes','no') NOT NULL,
  `image` text NOT NULL,
  `home_image` varchar(200) NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `entry_by` int(11) NOT NULL,
  `entry_user_type` varchar(255) DEFAULT NULL,
  `status` enum('active','deactive') NOT NULL,
  `isApprove` enum('authorize','unauthorize') NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_date` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `softDelete` tinyint(2) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `products_26122019`
--

INSERT INTO `products_26122019` (`id`, `product_name`, `category_id`, `product_sku`, `productPrice`, `brand_name`, `product_specification_id`, `product_specification_name`, `product_specification_details`, `product_specification_details_description`, `product_full_description`, `qc_status`, `image`, `home_image`, `vendor_id`, `entry_by`, `entry_user_type`, `status`, `isApprove`, `created_date`, `updated_date`, `softDelete`) VALUES
(4, 'Mens Product', 2, 'BNJ-0006-00003', 0, '', NULL, '[{\"categoryId\":\"2\",\"specificationNameId\":\"1\",\"specificationNameValue\":\"Green\"},{\"categoryId\":\"2\",\"specificationNameId\":\"1\",\"specificationNameValue\":\"Blue\"},{\"categoryId\":\"2\",\"specificationNameId\":\"1\",\"specificationNameValue\":\"Red\"},{\"categoryId\":\"2\",\"specificationNameId\":\"1\",\"specificationNameValue\":\"Blue\"},{\"categoryId\":\"2\",\"specificationNameId\":\"1\",\"specificationNameValue\":\"Green\"}]', NULL, '[]', '[{\"title\":\"Test\",\"description\":\"Descriptions\nsdfs;dlfjklsdjf\",\"descriptionImage\":\"rose.jpg\"},{\"title\":\"TTTTTTTTTT\",\"description\":\"DDDDDDDDDD\",\"descriptionImage\":\"iiii.jpg\"}]', 'yes', '[{\"imageName\":\"ppppp.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"yyyy.jpg\",\"serialNumber\":\"4\"},{\"imageName\":\"iiii.jpg\",\"serialNumber\":\"5\"}]', 'ppppp.jpg', 1, 0, NULL, 'active', 'authorize', '2019-10-15 11:35:22', '2019-10-27 07:51:58', 1),
(5, 'Half shirt', 2, 'BNJ-0000-00002', 0, '', NULL, '[{\"categoryId\":\"2\",\"specificationNameId\":\"1\",\"specificationNameValue\":\"Red\"},{\"categoryId\":\"2\",\"specificationNameId\":\"1\",\"specificationNameValue\":\"Green\"},{\"categoryId\":\"2\",\"specificationNameId\":\"1\",\"specificationNameValue\":\"Blue\"},{\"categoryId\":\"2\",\"specificationNameId\":\"1\",\"specificationNameValue\":\"Black\"}]', NULL, '[]', '[{\"title\":\"Half Shirt\",\"description\":\"ddfdfdf\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"Half Shirt 01.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"Half Shirt 02.JPG\",\"serialNumber\":\"4\"},{\"imageName\":\"Half Shirt 03.jpg\",\"serialNumber\":\"5\"}]', 'Half Shirt 01.jpg', 1, 0, NULL, 'active', 'authorize', '2019-10-22 09:22:05', '2019-10-27 07:52:06', 1),
(6, 'Half shirt', 2, 'BNJ-0000-00003', 0, '', NULL, '[{\"categoryId\":\"2\",\"specificationNameId\":\"1\",\"specificationNameValue\":\"Red\"},{\"categoryId\":\"2\",\"specificationNameId\":\"1\",\"specificationNameValue\":\"Green\"}]', NULL, '[]', '[{\"title\":\"M HS\",\"description\":\"lhjhkjhkj\",\"descriptionImage\":\"4G.png\"}]', 'yes', '[{\"imageName\":\"Half Shirt 02.JPG\",\"serialNumber\":\"3\"},{\"imageName\":\"Half Shirt 01.jpg\",\"serialNumber\":\"4\"},{\"imageName\":\"Half Shirt 03.jpg\",\"serialNumber\":\"5\"}]', 'Half Shirt 02.JPG', 5, 0, NULL, 'active', 'authorize', '2019-10-22 11:32:14', '2019-10-27 10:54:58', 1),
(7, 'abc', 15, 'BNJ-0000-00004', 0, '', NULL, '[]', NULL, '[]', '[{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"4G01.jpeg\",\"serialNumber\":\"3\"},{\"imageName\":\"02-BUTTLER.jpg\",\"serialNumber\":\"4\"}]', '4G01.jpeg', 1, 0, NULL, 'active', 'authorize', '2019-10-22 11:34:04', '2019-10-27 10:54:51', 1),
(8, 'Half shirt', 16, 'BNJ-0000-00005', 0, '', NULL, '[{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"40\"},{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"42\"},{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"45\"}]', NULL, '[{\"specificationDetailsName\":\"Cotton\",\"specificationDetailsValue\":\"40/60\"}]', '[{\"title\":\"ABC\",\"description\":\"fdhfdhfgdh\",\"descriptionImage\":\"21-podok.jpg\"}]', 'yes', '[{\"imageName\":\"Shirt01.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"Shirt02.png\",\"serialNumber\":\"4\"}]', 'Shirt01.jpg', 0, 0, NULL, 'active', 'authorize', '2019-10-24 06:54:56', '2019-10-27 10:54:44', 1),
(9, 'dfsfsdf', 16, 'BNJ-0006-00001', 0, '', NULL, '[{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"40\"}]', NULL, '[]', '[{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"yyyy.jpg\",\"serialNumber\":\"3\"}]', 'yyyy.jpg', 6, 0, NULL, 'active', 'authorize', '2019-10-27 11:00:57', '2019-10-27 11:24:17', 1),
(10, 'dfsfsdf', 16, 'BNJ-0006-00001', 0, '', NULL, '[{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"40\"}]', NULL, '[]', '[{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"yyyy.jpg\",\"serialNumber\":\"3\"}]', 'yyyy.jpg', 6, 0, NULL, 'active', 'authorize', '2019-10-27 11:01:18', '2019-10-27 11:24:28', 1),
(11, 'dfsfsdf', 16, 'BNJ-0006-00001', 0, '', NULL, '[{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"40\"}]', NULL, '[]', '[{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"yyyy.jpg\",\"serialNumber\":\"3\"}]', 'yyyy.jpg', 6, 0, NULL, 'active', 'authorize', '2019-10-27 11:16:14', '2019-10-27 11:24:37', 1),
(12, '', 16, 'BNJ-0001-00004', 0, '', NULL, '[{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"40\"},{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"45\"},{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"45\"},{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"42\"}]', NULL, '[]', '[{\"title\":\"hgjghj\",\"description\":\"kjkjhkjkkjk\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"Shirt01.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"Shirt02.png\",\"serialNumber\":\"4\"}]', 'Shirt01.jpg', 1, 0, NULL, 'active', 'authorize', '2019-10-27 11:25:36', '2019-11-04 06:06:36', 1),
(13, 'Tanin chair', 18, 'BNJ-0007-00002', 0, '', NULL, '[{\"categoryId\":\"18\",\"specificationNameId\":\"5\",\"specificationNameValue\":\"borak\"},{\"categoryId\":\"18\",\"specificationNameId\":\"4\",\"specificationNameValue\":\"4 inch\"},{\"categoryId\":\"18\",\"specificationNameId\":\"4\",\"specificationNameValue\":\"5 inch\"},{\"categoryId\":\"18\",\"specificationNameId\":\"4\",\"specificationNameValue\":\"5 inch\"}]', NULL, '[{\"specificationDetailsName\":\"age\",\"specificationDetailsValue\":\"10\"}]', '[{\"title\":\"test\",\"description\":\"test\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"bamboo-garden-chair-500x500.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"bamboo-garden-chair-500x500.jpg\",\"serialNumber\":\"4\"}]', 'bamboo-garden-chair-500x500.jpg', 7, 0, NULL, 'active', 'authorize', '2019-10-28 06:51:38', '2019-10-28 06:54:23', 1),
(14, 'Tanin Chair', 18, 'BNJ-0001-00005', 0, '', NULL, '[{\"categoryId\":\"18\",\"specificationNameId\":\"5\",\"specificationNameValue\":\"borak\"},{\"categoryId\":\"18\",\"specificationNameId\":\"4\",\"specificationNameValue\":\"4 inch\"}]', NULL, '[{\"specificationDetailsName\":\"age\",\"specificationDetailsValue\":\"10\"}]', '[{\"title\":\"Test\",\"description\":\"Test\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"bamboo-garden-chair-500x500.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"bamboo-garden-chair-500x500.jpg\",\"serialNumber\":\"4\"}]', 'bamboo-garden-chair-500x500.jpg', 1, 0, NULL, 'active', 'authorize', '2019-10-28 06:55:22', '2019-11-04 06:06:30', 1),
(15, 'RF Chair', 18, 'BNJ-0001-00003', 0, '', NULL, '[{\"categoryId\":\"18\",\"specificationNameId\":\"5\",\"specificationNameValue\":\"chinese\"},{\"categoryId\":\"18\",\"specificationNameId\":\"4\",\"specificationNameValue\":\"4 inch\"}]', NULL, '[{\"specificationDetailsName\":\"age\",\"specificationDetailsValue\":\"8\"}]', '[{\"title\":\"test\",\"description\":\"test\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"bamboo.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"bamboo.jpg\",\"serialNumber\":\"4\"}]', 'bamboo.jpg', 1, 0, NULL, 'active', 'authorize', '2019-10-28 07:07:59', '2019-11-04 06:06:24', 1),
(16, 'Test  Product', 12, 'BNJ-0002-00001', 0, '', NULL, '[]', NULL, '[]', '[{\"title\":\"Test Title\",\"description\":\"Test Description\",\"descriptionImage\":\"4G.png\"},{\"title\":\"Test Title Two\",\"description\":\"Test Description two\",\"descriptionImage\":\"Airport-Bus+Accident01.jpg\"}]', 'yes', '[{\"imageName\":\"4G01.jpeg\",\"serialNumber\":\"3\"}]', '4G01.jpeg', 2, 0, NULL, 'active', 'authorize', '2019-10-30 09:31:53', '2019-11-06 10:05:04', 1),
(17, 'bambo', 18, 'BNJ-0001-00007', 0, '', NULL, '[{\"categoryId\":\"18\",\"specificationNameId\":\"5\",\"specificationNameValue\":\"borak\"},{\"categoryId\":\"18\",\"specificationNameId\":\"5\",\"specificationNameValue\":\"chinese\"},{\"categoryId\":\"18\",\"specificationNameId\":\"4\",\"specificationNameValue\":\"2 inch\"},{\"categoryId\":\"18\",\"specificationNameId\":\"4\",\"specificationNameValue\":\"4 inch\"},{\"categoryId\":\"18\",\"specificationNameId\":\"4\",\"specificationNameValue\":\"5 inch\"}]', NULL, '[]', '[{\"title\":\"ghgh\",\"description\":\"gjg\",\"descriptionImage\":\"02-BUTTLER.jpg\"}]', 'yes', '[{\"imageName\":\"02-BUTTLER.jpg\",\"serialNumber\":\"3\"}]', '02-BUTTLER.jpg', 1, 0, NULL, 'active', 'authorize', '2019-11-04 06:56:09', '2019-11-06 05:36:19', 1),
(18, 'Jute Bag', 15, 'BNJ-0001-00001', 0, '', NULL, '[]', NULL, '[]', '[{\"title\":\"Jute Bag\",\"description\":\"Made by Jute\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"20191022_154037.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"20191022_154145.jpg\",\"serialNumber\":\"4\"},{\"imageName\":\"20191022_154253.jpg\",\"serialNumber\":\"5\"},{\"imageName\":\"20191022_154037.jpg\",\"serialNumber\":\"6\"},{\"imageName\":\"20191022_154145.jpg\",\"serialNumber\":\"7\"},{\"imageName\":\"20191022_154253.jpg\",\"serialNumber\":\"8\"},{\"imageName\":\"20191022_154037.jpg\",\"serialNumber\":\"9\"},{\"imageName\":\"20191022_154145.jpg\",\"serialNumber\":\"10\"},{\"imageName\":\"20191022_154253.jpg\",\"serialNumber\":\"11\"},{\"imageName\":\"20191022_154037.jpg\",\"serialNumber\":\"12\"}]', '20191022_154037.jpg', 1, 0, NULL, 'active', 'authorize', '2019-11-06 10:08:32', '2019-11-06 10:12:12', 1),
(19, 'Test Product Bamboo', 18, 'BNJ-0002-00001', 0, '', NULL, '[{\"categoryId\":\"18\",\"specificationNameId\":\"5\",\"specificationNameValue\":\"chinese\"},{\"categoryId\":\"18\",\"specificationNameId\":\"4\",\"specificationNameValue\":\"4 inch\"}]', NULL, '[{\"specificationDetailsName\":\"size\",\"specificationDetailsValue\":\"12\"},{\"specificationDetailsName\":\"chair type\",\"specificationDetailsValue\":\"easy\"},{\"specificationDetailsName\":\"is flexible\",\"specificationDetailsValue\":\"yes\"}]', '[{\"title\":\"Test\",\"description\":\"Test\",\"descriptionImage\":\"bamboo.jpg\"}]', 'yes', '[{\"imageName\":\"bamboo.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"bamboo-garden-chair-500x500.jpg\",\"serialNumber\":\"4\"},{\"imageName\":\"bamboo.jpg\",\"serialNumber\":\"5\"},{\"imageName\":\"bamboo-garden-chair-500x500.jpg\",\"serialNumber\":\"6\"},{\"imageName\":\"bamboo.jpg\",\"serialNumber\":\"7\"},{\"imageName\":\"bamboo-garden-chair-500x500.jpg\",\"serialNumber\":\"8\"},{\"imageName\":\"bamboo.jpg\",\"serialNumber\":\"9\"},{\"imageName\":\"bamboo-garden-chair-500x500.jpg\",\"serialNumber\":\"10\"},{\"imageName\":\"bamboo.jpg\",\"serialNumber\":\"11\"},{\"imageName\":\"bamboo-garden-chair-500x500.jpg\",\"serialNumber\":\"12\"}]', 'bamboo.jpg', 2, 0, NULL, 'active', 'authorize', '2019-11-06 10:09:59', '2019-11-06 10:50:27', 1),
(20, 'Testing Products', 5, 'BNJ-0002-00003', 0, '', NULL, '[{\"categoryId\":\"5\",\"specificationNameId\":\"3\",\"specificationNameValue\":\"100\"}]', NULL, '[]', '[{\"title\":\"Hello\",\"description\":\"gggg\",\"descriptionImage\":\"lather_jacket.jpg\"}]', 'yes', '[{\"imageName\":\"lather_jacket.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"lather_jacket_women.jpg\",\"serialNumber\":\"4\"}]', 'lather_jacket.jpg', 2, 0, NULL, 'active', 'authorize', '2019-11-06 10:11:33', '2019-11-06 10:57:24', 1),
(21, 'Test Test', 16, 'BNJ-0002-00004', 0, '', NULL, '[{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"42\"},{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"40\"},{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"45\"}]', NULL, '[]', '[{\"title\":\"test\",\"description\":\"dsfdss\",\"descriptionImage\":\"shirt-1.jpg\"}]', 'yes', '[{\"imageName\":\"shirt-1.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"shirt-1.jpg\",\"serialNumber\":\"4\"}]', 'shirt-1.jpg', 2, 0, NULL, 'active', 'authorize', '2019-11-06 10:18:21', '2019-11-06 10:23:23', 1),
(22, 'Test Test', 16, 'BNJ-0002-00004', 0, '', NULL, '[{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"42\"},{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"40\"},{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"45\"}]', NULL, '[]', '[{\"title\":\"test\",\"description\":\"dsfdss\",\"descriptionImage\":\"shirt-1.jpg\"}]', 'yes', '[{\"imageName\":\"shirt-1.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"shirt-1.jpg\",\"serialNumber\":\"4\"}]', 'shirt-1.jpg', 2, 0, NULL, 'active', 'authorize', '2019-11-06 10:23:09', NULL, 0),
(23, 'Test shirt 3', 16, 'BNJ-0002-00006', 0, '', NULL, '[{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"40\"},{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"42\"},{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"45\"}]', NULL, '[]', '[{\"title\":\"test\",\"description\":\"sdfsdffdsdfsfdsf\",\"descriptionImage\":\"shirt-3.jpg\"}]', 'yes', '[{\"imageName\":\"shirt-3.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"shirt-3.jpg\",\"serialNumber\":\"4\"}]', 'shirt-3.jpg', 2, 0, NULL, 'active', 'authorize', '2019-11-06 10:24:25', '2019-12-01 07:51:57', 1),
(24, 'Test Shirt 4', 16, 'BNJ-0002-00007', 0, '', NULL, '[{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"45\"},{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"42\"},{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"40\"}]', NULL, '[]', '[{\"title\":\"test\",\"description\":\"dfdsffgdf dgfsdfgfd dgfsfgfds dsffggdf dsfgdfgf sdfdsfdg \",\"descriptionImage\":\"shirt-4.jpg\"}]', 'yes', '[{\"imageName\":\"shirt-4.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"shirt-4.jpg\",\"serialNumber\":\"4\"},{\"imageName\":\"shirt-4.jpg\",\"serialNumber\":\"5\"},{\"imageName\":\"shirt-4.jpg\",\"serialNumber\":\"6\"},{\"imageName\":\"shirt-4.jpg\",\"serialNumber\":\"7\"},{\"imageName\":\"shirt-4.jpg\",\"serialNumber\":\"8\"},{\"imageName\":\"shirt-4.jpg\",\"serialNumber\":\"9\"},{\"imageName\":\"shirt-4.jpg\",\"serialNumber\":\"10\"},{\"imageName\":\"shirt-4.jpg\",\"serialNumber\":\"11\"},{\"imageName\":\"shirt-4.jpg\",\"serialNumber\":\"12\"}]', 'shirt-4.jpg', 2, 0, NULL, 'active', 'authorize', '2019-11-06 10:25:55', '2019-12-01 07:51:51', 1),
(25, 'Test Product 5', 16, 'BNJ-0002-00008', 0, '', NULL, '[{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"40\"},{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"42\"},{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"45\"}]', NULL, '[]', '[{\"title\":\"test\",\"description\":\"Testing this Product For Banijjo.com.bd\",\"descriptionImage\":\"testing.png\"}]', 'yes', '[{\"imageName\":\"2.png\",\"serialNumber\":\"3\"},{\"imageName\":\"shirt-5.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"2.png\",\"serialNumber\":\"4\"},{\"imageName\":\"3.png\",\"serialNumber\":\"5\"},{\"imageName\":\"4.png\",\"serialNumber\":\"6\"},{\"imageName\":\"5.png\",\"serialNumber\":\"7\"},{\"imageName\":\"6.png\",\"serialNumber\":\"8\"},{\"imageName\":\"7.png\",\"serialNumber\":\"9\"},{\"imageName\":\"8.png\",\"serialNumber\":\"10\"},{\"imageName\":\"9.png\",\"serialNumber\":\"11\"},{\"imageName\":\"10.png\",\"serialNumber\":\"12\"}]', 'shirt-5.jpg', 2, 0, NULL, 'active', 'unauthorize', '2019-11-06 10:41:48', '2019-11-07 06:28:01', 1),
(26, 'Test Banner', 16, 'BNJ-0002-00009', 0, '', NULL, '[{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"40\"},{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"42\"},{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"45\"}]', NULL, '[]', '[{\"title\":\"Test\",\"description\":\"Test Banner\",\"descriptionImage\":\"testbanner.png\"}]', 'yes', '[{\"imageName\":\"testbanner.png\",\"serialNumber\":\"3\"},{\"imageName\":\"testbanner.png\",\"serialNumber\":\"4\"},{\"imageName\":\"testbanner.png\",\"serialNumber\":\"5\"},{\"imageName\":\"testbanner.png\",\"serialNumber\":\"6\"}]', 'testbanner.png', 2, 0, NULL, 'active', 'authorize', '2019-11-09 11:35:04', '2019-12-01 07:51:45', 1),
(27, 'Test Banner 2', 16, 'BNJ-0002-000010', 0, '', NULL, '[{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"40\"},{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"42\"},{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"45\"}]', NULL, '[]', '[{\"title\":\"Hello\",\"description\":\"Test Banner 2\",\"descriptionImage\":\"testbanner2.png\"}]', 'yes', '[{\"imageName\":\"testbanner2.png\",\"serialNumber\":\"3\"},{\"imageName\":\"testbanner2.png\",\"serialNumber\":\"4\"},{\"imageName\":\"testbanner2.png\",\"serialNumber\":\"5\"},{\"imageName\":\"testbanner2.png\",\"serialNumber\":\"6\"}]', 'testbanner2.png', 2, 0, NULL, 'active', 'authorize', '2019-11-09 11:45:53', '2019-12-01 07:51:39', 1),
(28, 'Sandle Shoes', 5, 'BNJ-0001-00001', 0, '', NULL, '[{\"categoryId\":\"5\",\"specificationNameId\":\"3\",\"specificationNameValue\":\"100\"}]', NULL, '[]', '[{\"title\":\"Ladies Sandle \",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"Banijjo Ladies Sendale Leather Products.jpg\",\"serialNumber\":\"3\"}]', 'Banijjo Ladies Sendale Leather Products.jpg', 1, 0, NULL, 'active', 'authorize', '2019-11-20 08:59:41', '2019-12-01 07:51:33', 1),
(29, 'Ladies Sandle', 5, 'BNJ-0001-00002', 0, '', NULL, '[{\"categoryId\":\"5\",\"specificationNameId\":\"3\",\"specificationNameValue\":\"100\"}]', NULL, '[]', '[{\"title\":\"Ladies Sandle Shoes\",\"description\":\"Made by 100% pure Leather\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"Banijjo Leather Products.jpg\",\"serialNumber\":\"3\"}]', 'Banijjo Leather Products.jpg', 1, 0, NULL, 'active', 'authorize', '2019-11-20 09:01:08', '2019-12-01 07:51:26', 1),
(30, 'Jute Bag', 15, 'BNJ-0001-00001', 0, '', NULL, '[]', NULL, '[]', '[{\"title\":\"Jute Bag\",\"description\":\"Made by Handloom Jute cloth and combination with Artificial Leather.\",\"descriptionImage\":\"\"},{\"title\":\"Jute Bag\",\"description\":\"Make various type of Handloom Jute Bag\",\"descriptionImage\":\"\"},{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"Handloom-Jute-Bag.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"Handloom-Jute-Bag-front-view.jpg\",\"serialNumber\":\"4\"},{\"imageName\":\"Handloom-Jute-Bag-Model.jpg\",\"serialNumber\":\"5\"},{\"imageName\":\"Handloom-Jute-Bag.jpg\",\"serialNumber\":\"6\"},{\"imageName\":\"Handloom-Jute-Bag-front-view.jpg\",\"serialNumber\":\"7\"},{\"imageName\":\"Handloom-Jute-Bag-Model.jpg\",\"serialNumber\":\"8\"},{\"imageName\":\"Handloom-Jute-Bag.jpg\",\"serialNumber\":\"9\"},{\"imageName\":\"Handloom-Jute-Bag-front-view.jpg\",\"serialNumber\":\"10\"},{\"imageName\":\"Handloom-Jute-Bag-Model.jpg\",\"serialNumber\":\"11\"},{\"imageName\":\"Handloom-Jute-Bag-Model.jpg\",\"serialNumber\":\"12\"}]', 'Handloom-Jute-Bag.jpg', 1, 0, NULL, 'active', 'authorize', '2019-12-01 11:27:00', '2019-12-04 14:18:34', 1),
(31, 'Jute Bag', 15, 'BNJ-0001-00001', 0, '', NULL, '[]', NULL, '[]', '[{\"title\":\"Jute Bag\",\"description\":\"Made by Handloom Jute cloth and combination with Artificial Leather.\",\"descriptionImage\":\"\"},{\"title\":\"Jute Bag\",\"description\":\"Make various type of Handloom Jute Bag\",\"descriptionImage\":\"\"},{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"Handloom-Jute-Bag.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"Handloom-Jute-Bag-front-view.jpg\",\"serialNumber\":\"4\"},{\"imageName\":\"Handloom-Jute-Bag-Model.jpg\",\"serialNumber\":\"5\"},{\"imageName\":\"Handloom-Jute-Bag.jpg\",\"serialNumber\":\"6\"},{\"imageName\":\"Handloom-Jute-Bag-front-view.jpg\",\"serialNumber\":\"7\"},{\"imageName\":\"Handloom-Jute-Bag-Model.jpg\",\"serialNumber\":\"8\"},{\"imageName\":\"Handloom-Jute-Bag.jpg\",\"serialNumber\":\"9\"},{\"imageName\":\"Handloom-Jute-Bag-front-view.jpg\",\"serialNumber\":\"10\"},{\"imageName\":\"Handloom-Jute-Bag-Model.jpg\",\"serialNumber\":\"11\"},{\"imageName\":\"Handloom-Jute-Bag-Model.jpg\",\"serialNumber\":\"12\"}]', 'Handloom-Jute-Bag.jpg', 1, 0, NULL, 'active', 'authorize', '2019-12-01 11:27:03', '2019-12-04 14:18:28', 1),
(32, 'Jute Bag', 15, 'BNJ-0001-00001', 0, '', NULL, '[]', NULL, '[]', '[{\"title\":\"Jute Bag\",\"description\":\"Made by Handloom Jute cloth and combination with Artificial Leather.\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"Handloom-Jute-Bag.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"Handloom-Jute-Bag-front-view.jpg\",\"serialNumber\":\"4\"},{\"imageName\":\"Handloom-Jute-Bag-Model.jpg\",\"serialNumber\":\"5\"},{\"imageName\":\"Handloom-Jute-Bag.jpg\",\"serialNumber\":\"6\"},{\"imageName\":\"Handloom-Jute-Bag-front-view.jpg\",\"serialNumber\":\"7\"},{\"imageName\":\"Handloom-Jute-Bag-Model.jpg\",\"serialNumber\":\"8\"},{\"imageName\":\"Handloom-Jute-Bag.jpg\",\"serialNumber\":\"9\"},{\"imageName\":\"Handloom-Jute-Bag-front-view.jpg\",\"serialNumber\":\"10\"},{\"imageName\":\"Handloom-Jute-Bag-Model.jpg\",\"serialNumber\":\"11\"},{\"imageName\":\"Handloom-Jute-Bag-Model.jpg\",\"serialNumber\":\"12\"}]', 'Handloom-Jute-Bag.jpg', 1, 0, NULL, 'active', 'authorize', '2019-12-01 11:27:19', '2019-12-04 14:18:20', 1),
(33, '', 15, 'BNJ-0001-00001', 0, '', NULL, '[]', NULL, '[]', '[{\"title\":\"Jute Bag\",\"description\":\"Made by Handloom Jute cloth and combination with Artificial Leather.\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"Handloom-Jute-Bag.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"Handloom-Jute-Bag-front-view.jpg\",\"serialNumber\":\"4\"},{\"imageName\":\"Handloom-Jute-Bag-Model.jpg\",\"serialNumber\":\"5\"},{\"imageName\":\"Handloom-Jute-Bag.jpg\",\"serialNumber\":\"6\"},{\"imageName\":\"Handloom-Jute-Bag-front-view.jpg\",\"serialNumber\":\"7\"},{\"imageName\":\"Handloom-Jute-Bag-Model.jpg\",\"serialNumber\":\"8\"},{\"imageName\":\"Handloom-Jute-Bag.jpg\",\"serialNumber\":\"9\"},{\"imageName\":\"Handloom-Jute-Bag-front-view.jpg\",\"serialNumber\":\"10\"},{\"imageName\":\"Handloom-Jute-Bag-Model.jpg\",\"serialNumber\":\"11\"},{\"imageName\":\"Handloom-Jute-Bag-Model.jpg\",\"serialNumber\":\"12\"},{\"imageName\":\"Handloom-Jute-Bag.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"Handloom-Jute-Bag-front-view.jpg\",\"serialNumber\":\"4\"},{\"imageName\":\"Handloom-Jute-Bag-Model.jpg\",\"serialNumber\":\"5\"}]', 'Handloom-Jute-Bag.jpg', 1, 0, NULL, 'active', 'authorize', '2019-12-01 11:27:30', '2019-12-04 14:18:06', 1),
(34, 'test product', 18, 'BNJ-0001-00005', 0, '', NULL, '[{\"categoryId\":\"18\",\"specificationNameId\":\"5\",\"specificationNameValue\":\"borak\"},{\"categoryId\":\"18\",\"specificationNameId\":\"5\",\"specificationNameValue\":\"chinese\"},{\"categoryId\":\"18\",\"specificationNameId\":\"4\",\"specificationNameValue\":\"4 inch\"},{\"categoryId\":\"18\",\"specificationNameId\":\"4\",\"specificationNameValue\":\"5 inch\"}]', NULL, '[]', '[{\"title\":\"dfdg\",\"description\":\"sdfsdf\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"check.png\",\"serialNumber\":\"3\"},{\"imageName\":\"check.png\",\"serialNumber\":\"4\"},{\"imageName\":\"check.png\",\"serialNumber\":\"5\"},{\"imageName\":\"check.png\",\"serialNumber\":\"6\"},{\"imageName\":\"check.png\",\"serialNumber\":\"7\"},{\"imageName\":\"check.png\",\"serialNumber\":\"8\"},{\"imageName\":\"check.png\",\"serialNumber\":\"9\"},{\"imageName\":\"check.png\",\"serialNumber\":\"10\"},{\"imageName\":\"check.png\",\"serialNumber\":\"11\"},{\"imageName\":\"check.png\",\"serialNumber\":\"12\"}]', 'check.png', 1, 0, NULL, 'active', 'authorize', '2019-12-02 06:20:07', '2019-12-04 14:05:25', 1),
(35, 'check OK', 15, 'BNJ-0001-00006', 0, '', NULL, '[]', NULL, '[{\"specificationDetailsName\":\"Color\",\"specificationDetailsValue\":\"sadas\"},{\"specificationDetailsName\":\"Size\",\"specificationDetailsValue\":\"10\"}]', '[{\"title\":\"sdsa\",\"description\":\"fdfsdsfds\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"check.png\",\"serialNumber\":\"3\"},{\"imageName\":\"check.png\",\"serialNumber\":\"4\"},{\"imageName\":\"check.png\",\"serialNumber\":\"5\"},{\"imageName\":\"check.png\",\"serialNumber\":\"6\"},{\"imageName\":\"check.png\",\"serialNumber\":\"7\"},{\"imageName\":\"check.png\",\"serialNumber\":\"8\"},{\"imageName\":\"check.png\",\"serialNumber\":\"9\"},{\"imageName\":\"check.png\",\"serialNumber\":\"10\"},{\"imageName\":\"check.png\",\"serialNumber\":\"11\"},{\"imageName\":\"check.png\",\"serialNumber\":\"12\"}]', 'check.png', 1, 0, NULL, 'active', 'authorize', '2019-12-02 06:24:09', '2019-12-04 14:05:18', 1),
(36, 'test product', 18, 'BNJ-0001-00007', 0, '', NULL, '[{\"categoryId\":\"18\",\"specificationNameId\":\"5\",\"specificationNameValue\":\"borak\"},{\"categoryId\":\"18\",\"specificationNameId\":\"5\",\"specificationNameValue\":\"chinese\"},{\"categoryId\":\"18\",\"specificationNameId\":\"4\",\"specificationNameValue\":\"4 inch\"},{\"categoryId\":\"18\",\"specificationNameId\":\"4\",\"specificationNameValue\":\"5 inch\"}]', NULL, '[]', '[{\"title\":\"sdsa\",\"description\":\"jfhsdakfhdfkjh\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"check.png\",\"serialNumber\":\"3\"},{\"imageName\":\"check.png\",\"serialNumber\":\"4\"},{\"imageName\":\"check.png\",\"serialNumber\":\"5\"},{\"imageName\":\"check.png\",\"serialNumber\":\"6\"},{\"imageName\":\"check.png\",\"serialNumber\":\"7\"},{\"imageName\":\"check.png\",\"serialNumber\":\"8\"},{\"imageName\":\"check.png\",\"serialNumber\":\"9\"},{\"imageName\":\"check.png\",\"serialNumber\":\"10\"},{\"imageName\":\"check.png\",\"serialNumber\":\"11\"},{\"imageName\":\"check.png\",\"serialNumber\":\"12\"}]', 'check.png', 1, 0, NULL, 'active', 'authorize', '2019-12-02 06:33:56', '2019-12-04 14:05:12', 1),
(37, 'Jute Bag', 15, 'BNJ-00017-00001', 0, '', NULL, '[]', NULL, '[{\"specificationDetailsName\":\"Color\",\"specificationDetailsValue\":\"Natural\"},{\"specificationDetailsName\":\"Size\",\"specificationDetailsValue\":\"22\"\"}]', '[{\"title\":\"Ladies Jute Bag\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"Handloom-Jute-Bag-front-view.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"Handloom-Jute-Bag.jpg\",\"serialNumber\":\"4\"},{\"imageName\":\"Handloom-Jute-Bag-Model.jpg\",\"serialNumber\":\"5\"},{\"imageName\":\"Handloom-Jute-Bag-front-view.jpg\",\"serialNumber\":\"6\"},{\"imageName\":\"Handloom-Jute-Bag.jpg\",\"serialNumber\":\"7\"},{\"imageName\":\"Handloom-Jute-Bag-Model.jpg\",\"serialNumber\":\"8\"},{\"imageName\":\"Handloom-Jute-Bag-front-view.jpg\",\"serialNumber\":\"9\"},{\"imageName\":\"Handloom-Jute-Bag.jpg\",\"serialNumber\":\"10\"},{\"imageName\":\"Handloom-Jute-Bag-Model.jpg\",\"serialNumber\":\"11\"},{\"imageName\":\"Handloom-Jute-Bag.jpg\",\"serialNumber\":\"12\"}]', 'H.jpg', 17, 0, NULL, 'active', 'authorize', '2019-12-04 14:03:39', '2019-12-16 06:34:27', 0),
(38, '', 16, 'BNJ-00017-00002', 0, '', NULL, '[{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"40\"},{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"42\"}]', NULL, '[]', '[{\"title\":\"erre\",\"description\":\"dfgff\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"02-BUTTLER.jpg\",\"serialNumber\":\"3\"}]', '02-BUTTLER.jpg', 17, 0, NULL, 'active', 'authorize', '2019-12-09 12:12:11', '2019-12-09 12:13:13', 1),
(39, 'Half shirt01', 16, 'BNJ-00017-00003', 0, '', NULL, '[{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"40\"},{\"categoryId\":\"16\",\"specificationNameId\":\"2\",\"specificationNameValue\":\"42\"}]', NULL, '[]', '[{\"title\":\"gdfgdg\",\"description\":\"fgfgdfgdfgfdgfdg\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"02-BUTTLER.jpg\",\"serialNumber\":\"3\"}]', '02-BUTTLER.jpg', 17, 0, NULL, 'active', 'authorize', '2019-12-09 12:14:04', '2019-12-24 11:22:40', 1),
(40, 'Testing Testing Product', 19, 'BNJ-00017-00004', 0, '', NULL, '[]', NULL, '[]', '[{\"title\":\"dsfdsfd\",\"description\":\"sdfdsfd\",\"descriptionImage\":\"lather_jacket.jpg\"}]', 'yes', '[{\"imageName\":\"lather_jacket.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"lather_jacket.jpg\",\"serialNumber\":\"4\"}]', 'lather_jacket.jpg', 17, 0, NULL, 'active', 'unauthorize', '2019-12-10 03:36:01', '2019-12-24 08:03:35', 0),
(41, 'Testing Vendors Product', 19, 'BNJ-00019-00001', 0, '', NULL, '[]', NULL, '[]', '[{\"title\":\"Hello\",\"description\":\"sdfdsfdsfdsffdsfd sfdffdsfsd dfsd\",\"descriptionImage\":\"bamboo.jpg\"}]', 'yes', '[{\"imageName\":\"bamboo.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"bamboo.jpg\",\"serialNumber\":\"4\"},{\"imageName\":\"bamboo.jpg\",\"serialNumber\":\"5\"},{\"imageName\":\"bamboo.jpg\",\"serialNumber\":\"6\"}]', 'bamboo.jpg', 19, 0, NULL, 'active', 'authorize', '2019-12-10 04:02:22', '2019-12-10 05:54:58', 1),
(42, 'Test Resels Product', 19, 'BNJ-00021-00001', 1000, 'Checking Update', NULL, '[]', NULL, '[]', '[{\"title\":\"test\",\"description\":\"dfsfdsdf\",\"descriptionImage\":\"lather_jacket_women.jpg\"}]', 'yes', '[{\"imageName\":\"lather_jacket_women.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"bamboo.jpg\",\"serialNumber\":\"4\"},{\"imageName\":\"lather_jacket_women.jpg\",\"serialNumber\":\"5\"},{\"imageName\":\"lather_jacket_women.jpg\",\"serialNumber\":\"6\"},{\"imageName\":\"lather_jacket_women.jpg\",\"serialNumber\":\"7\"},{\"imageName\":\"lather_jacket_women.jpg\",\"serialNumber\":\"8\"},{\"imageName\":\"lather_jacket_women.jpg\",\"serialNumber\":\"9\"},{\"imageName\":\"lather_jacket_women.jpg\",\"serialNumber\":\"10\"},{\"imageName\":\"lather_jacket_women.jpg\",\"serialNumber\":\"11\"},{\"imageName\":\"lather_jacket_women.jpg\",\"serialNumber\":\"12\"}]', 'lather_jacket_women.jpg', 21, 0, NULL, 'active', 'authorize', '2019-12-10 05:51:33', '2019-12-24 05:35:55', 0),
(43, 'BT  Test', 19, 'BNJ-00025-00001', 0, '', NULL, '[]', NULL, '[]', '[{\"title\":\"Hello\",\"description\":\"dssfdsfsfs\",\"descriptionImage\":\"lather_jacket_women.jpg\"}]', 'yes', '[{\"imageName\":\"images.png\",\"serialNumber\":\"3\"},{\"imageName\":\"123.png\",\"serialNumber\":\"3\"},{\"imageName\":\"icearow1.png\",\"serialNumber\":\"4\"}]', '123.png', 25, 0, NULL, 'active', 'authorize', '2019-12-17 06:55:47', '2019-12-24 08:03:16', 1),
(44, 'Product 25', 21, 'BNJ-00025-00002', 0, '', NULL, '[]', NULL, '[]', '[{\"title\":\"Hello\",\"description\":\"dfsdfsdfdfs\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"123.png\",\"serialNumber\":\"3\"},{\"imageName\":\"logo1.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"postman.png\",\"serialNumber\":\"4\"},{\"imageName\":\"check.png\",\"serialNumber\":\"5\"}]', 'logo1.jpg', 25, 0, NULL, 'active', 'authorize', '2019-12-17 07:10:28', '2019-12-24 08:03:23', 1),
(45, 'undefined', 0, '', 0, '', NULL, '[]', NULL, '[]', '[{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[]', '', 0, 0, NULL, 'active', 'unauthorize', '2019-12-19 12:12:40', '2019-12-19 12:12:55', 1),
(46, 'Jute Bag', 15, 'BNJ-00017-00005', 350, 'Banijjo Jute Bag,Banijjo Jute Bag', NULL, '[]', NULL, '[]', '[{\"title\":\"Jute Bag\",\"description\":\"Made by jute\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"Handloom-Jute-Bag.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"Handloom-Jute-Bag-front-view.jpg\",\"serialNumber\":\"4\"},{\"imageName\":\"Handloom-Jute-Bag-Model.jpg\",\"serialNumber\":\"5\"},{\"imageName\":\"20191022_154037.jpg\",\"serialNumber\":\"6\"},{\"imageName\":\"20191022_154145.jpg\",\"serialNumber\":\"7\"},{\"imageName\":\"20191022_154253.jpg\",\"serialNumber\":\"8\"},{\"imageName\":\"a3f41587af131dfb17b5f597e4888022.jpg\",\"serialNumber\":\"9\"}]', 'Handloom-Jute-Bag.jpg', 17, 0, NULL, 'active', 'authorize', '2019-12-24 08:05:43', '2019-12-24 11:20:49', 1),
(47, 'Jute Bag', 15, 'BNJ-00017-00005', 350, 'Banijjo Jute Bag,Banijjo Jute Bag', NULL, '[]', NULL, '[]', '[{\"title\":\"Jute Bag\",\"description\":\"Made by jute\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"Handloom-Jute-Bag.jpg\",\"serialNumber\":\"3\"},{\"imageName\":\"Handloom-Jute-Bag-front-view.jpg\",\"serialNumber\":\"4\"},{\"imageName\":\"Handloom-Jute-Bag-Model.jpg\",\"serialNumber\":\"5\"},{\"imageName\":\"20191022_154037.jpg\",\"serialNumber\":\"6\"},{\"imageName\":\"20191022_154145.jpg\",\"serialNumber\":\"7\"},{\"imageName\":\"20191022_154253.jpg\",\"serialNumber\":\"8\"},{\"imageName\":\"a3f41587af131dfb17b5f597e4888022.jpg\",\"serialNumber\":\"9\"}]', 'Handloom-Jute-Bag.jpg', 17, 0, NULL, 'active', 'unauthorize', '2019-12-24 08:05:44', '2019-12-24 11:10:53', 0);

-- --------------------------------------------------------

--
-- Table structure for table `products_slug`
--

CREATE TABLE `products_slug` (
  `id` int(11) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `product_name` varchar(200) NOT NULL,
  `category_id` int(11) NOT NULL,
  `product_sku` text NOT NULL,
  `productPrice` double NOT NULL,
  `brand_name` varchar(255) NOT NULL,
  `product_specification_id` text DEFAULT NULL,
  `product_specification_name` text NOT NULL,
  `product_specification_details` text DEFAULT NULL,
  `product_specification_details_description` text NOT NULL,
  `product_full_description` text NOT NULL,
  `qc_status` enum('yes','no') NOT NULL,
  `image` text NOT NULL,
  `home_image` varchar(200) NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `entry_by` int(11) NOT NULL,
  `entry_user_type` varchar(255) DEFAULT NULL,
  `status` enum('active','deactive') NOT NULL,
  `isApprove` enum('authorize','unauthorize') NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_date` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `softDelete` tinyint(2) NOT NULL DEFAULT 0,
  `metaTags` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `products_slug`
--

INSERT INTO `products_slug` (`id`, `slug`, `product_name`, `category_id`, `product_sku`, `productPrice`, `brand_name`, `product_specification_id`, `product_specification_name`, `product_specification_details`, `product_specification_details_description`, `product_full_description`, `qc_status`, `image`, `home_image`, `vendor_id`, `entry_by`, `entry_user_type`, `status`, `isApprove`, `created_date`, `updated_date`, `softDelete`, `metaTags`) VALUES
(1, 'basket-be0s0v9', 'Basket', 4, 'BNJ-00027-00001', 500, 'RK,RK', NULL, '{}', NULL, '[]', '[{\"title\":\"Basket\",\"description\":\"Basket Room Cleaning\",\"descriptionImage\":\"5_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"12\"}]', '5_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 04:41:40', '2020-06-11 15:38:37', 0, '[\"Basket\",\"Cleaning Basket\"]'),
(3, 'basket-1-be1s02a', 'Basket-1', 4, 'BNJ-00027-00002', 500, 'FL,FL', NULL, '{}', NULL, '[]', '[{\"title\":\"Basket-1\",\"description\":\"Basket-1\",\"descriptionImage\":\"6_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"12\"}]', '6_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 05:31:09', '2020-06-11 15:38:37', 0, '[\"Basket-1\",\"Basket Cleaning\"]'),
(4, 'flower-be2s0lz', 'Flower', 4, 'BNJ-00027-00003', 80, 'RL,RL', NULL, '{}', NULL, '[]', '[{\"title\":\"Flower\",\"description\":\"Flower\",\"descriptionImage\":\"211405_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"12\"}]', '211405_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 06:02:32', '2020-06-11 15:38:37', 0, '[\"Flower\"]'),
(5, 'juice-be3s0d8', 'JUICE', 4, 'BNJ-00027-00004', 70, 'RL,RL', NULL, '{}', NULL, '[]', '[{\"title\":\"JUICE\",\"description\":\"JUICE\",\"descriptionImage\":\"2_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"12\"}]', '2_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 06:15:09', '2020-06-11 15:38:37', 0, '[\"JUICE\"]'),
(6, 'showpice-be4s0i5', 'SHOWPICE', 23, 'BNJ-00027-00005', 400, 'RL,RL', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"7\"]}', NULL, '[]', '[{\"title\":\"SHOWPICE\",\"description\":\"SHOWPICE\",\"descriptionImage\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"12\"}]', '4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 06:24:21', '2020-06-11 15:38:37', 0, '[\"SHOWPICE\"]'),
(7, 'potatos-be5s0p9', 'POTATOS', 23, 'BNJ-00027-00006', 150, 'RL,RL', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"7\"]}', NULL, '[]', '[{\"title\":\"POTATOS\",\"description\":\"POTATOS\",\"descriptionImage\":\"19016_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"12\"}]', '19016_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 06:28:20', '2020-06-11 15:38:38', 0, '[\"POTATOS\"]'),
(8, 'showpiece-be6s0dv', 'SHOWPIECE', 23, 'BNJ-00027-00007', 700, 'RL,RL', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"7\"]}', NULL, '[]', '[{\"title\":\"SHOWPIECE\",\"description\":\"SHOWPIECE\",\"descriptionImage\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"12\"}]', '8b48782bf796ec6febd963c0288bd78b_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 06:32:26', '2020-06-11 15:38:37', 0, '[\"SHOWPIECE\"]'),
(9, 'guns-be7s0f7', 'GUNS', 23, 'BNJ-00027-00008', 599, 'RND,RND', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"7\"]}', NULL, '[]', '[{\"title\":\"GUNS\",\"description\":\"GUNS\",\"descriptionImage\":\"30_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"12\"}]', '30_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 06:38:25', '2020-06-11 15:38:37', 0, '[\"GUNS\"]'),
(10, 'medicine-be8s0sc', 'MEDICINE', 23, 'BNJ-00027-00009', 400, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"MEDICINE\",\"description\":\"MEDICINE\",\"descriptionImage\":\"13_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"13_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"13_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"13_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"13_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"13_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"12\"}]', '13_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 06:42:10', '2020-06-11 15:38:37', 0, '[\"MEDICINE\"]'),
(11, 'guns-1-be9s08n', 'GUNS-1', 23, 'BNJ-00027-000010', 400, 'RND,RND', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"7\"]}', NULL, '[]', '[{\"title\":\"GUNS-1\",\"description\":\"GUNS-1\",\"descriptionImage\":\"10_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"10_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"10_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"10_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"10_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"10_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"12\"}]', '10_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 06:44:48', '2020-06-11 15:38:37', 0, '[\"GUNS-1\"]'),
(12, 'guns-2-beas01n', 'GUNS-2', 23, 'BNJ-00027-000011', 599, 'RND,RND', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"GUNS-2\",\"description\":\"GUNS-2\",\"descriptionImage\":\"32_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"12\"}]', '32_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 06:47:15', '2020-06-11 15:38:37', 0, '[\"GUNS-2\"]'),
(13, 'motorcycle-bebs06y', 'MOTORCYCLE', 23, 'BNJ-00027-000012', 120999, 'HB', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"MOTORCYCLE\",\"description\":\"MOTORCYCLE\",\"descriptionImage\":\"named1_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"12\"}]', 'named1_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 06:57:58', '2020-06-11 15:38:37', 0, '[\"MOTORCYCLE\"]'),
(14, 'motorcycle-1-becs0v5', 'MOTORCYCLE-1', 23, 'BNJ-00027-000013', 119990, 'HB', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"MOTORCYCLE-1\",\"description\":\"MOTORCYCLE-1\",\"descriptionImage\":\"named_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"12\"}]', 'named_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 07:02:16', '2020-06-11 15:38:37', 0, '[\"MOTORCYCLE-1\"]'),
(15, 'salt-bottle-beds0z5', 'SALT BOTTLE', 23, 'BNJ-00027-000014', 60, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"3\"]}', NULL, '[]', '[{\"title\":\"SALT BOTTLE\",\"description\":\"SALT BOTTLE\",\"descriptionImage\":\"images1_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"12\"}]', 'images1_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 07:05:34', '2020-06-11 15:38:37', 0, '[\"SALT BOTTLE\"]'),
(16, 'lamp-bees0bn', 'LAMP', 4, 'BNJ-00027-000015', 400, 'DLP,DLP', NULL, '{}', NULL, '[]', '[{\"title\":\"LAMP\",\"description\":\"LAMP\",\"descriptionImage\":\"nnamed_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"12\"}]', 'nnamed_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 07:16:16', '2020-06-11 15:38:37', 0, '[\"LAMP\"]'),
(17, 'strip-befs0v4', 'STRIP', 4, 'BNJ-00027-000016', 35, 'RL,RL', NULL, '{}', NULL, '[]', '[{\"title\":\"STRIP\",\"description\":\"STRIP\",\"descriptionImage\":\"12_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"12_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"11_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"12_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"11_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"12_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"11_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"12_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"11_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"12_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"11_2240x1680.png\",\"serialNumber\":\"12\"}]', '12_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 07:21:24', '2020-06-11 15:38:37', 0, '[]'),
(18, 'dairy-begs0rz', 'DAIRY', 4, 'BNJ-00027-000017', 100, 'RL,RL', NULL, '{}', NULL, '[]', '[{\"title\":\"DAIRY\",\"description\":\"DAIRY\",\"descriptionImage\":\"images_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"12\"}]', 'images_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 07:25:22', '2020-06-11 15:38:37', 0, '[\"DAIRY\"]'),
(19, 'sunglass-behs0xx', 'SUNGLASS', 4, 'BNJ-00027-000018', 250, 'LR,LR', NULL, '{}', NULL, '[]', '[{\"title\":\"SUNGLASS\",\"description\":\"SUNGLASS\",\"descriptionImage\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"12\"}]', 'wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 07:28:20', '2020-06-11 15:38:37', 0, '[\"SUNGLASS\"]'),
(20, 'belt-beis0da', 'BELT', 4, 'BNJ-00027-000019', 300, 'LOGO,LOGO', NULL, '{}', NULL, '[]', '[{\"title\":\"BELT\",\"description\":\"BELT\",\"descriptionImage\":\"unnamed_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"12\"}]', 'unnamed_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 07:32:13', '2020-06-11 15:38:37', 0, '[\"BELT\"]'),
(21, 'showpiece-2-bejs0e2', 'SHOWPIECE-2', 4, 'BNJ-00027-000020', 150, 'RL,RL', NULL, '{}', NULL, '[]', '[{\"title\":\"SHOWPIECE-2\",\"description\":\"SHOWPIECE-2\",\"descriptionImage\":\"IMG_8647-2240x1680_2240x1680.jpeg\"}]', 'yes', '[{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"12\"}]', 'IMG_8647-2240x1680_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 07:34:37', '2020-06-11 15:38:37', 0, '[\"SHOWPIECE-2\"]'),
(22, 'history-book-beks0bd', 'HISTORY BOOK', 4, 'BNJ-00027-000021', 599, 'LR,LR', NULL, '{}', NULL, '[]', '[{\"title\":\"HISTORY BOOK\",\"description\":\"HISTORY BOOK\",\"descriptionImage\":\"hRp38qO_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"12\"}]', 'hRp38qO_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 07:37:11', '2020-06-11 15:38:37', 0, '[\"HISTORY BOOK\"]'),
(23, 'camera-bels0wo', 'CAMERA', 4, 'BNJ-00027-000022', 71500, 'CANON,CANON', NULL, '{}', NULL, '[]', '[{\"title\":\"CAMERA\",\"description\":\"CAMERA\",\"descriptionImage\":\"29_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"12\"}]', '29_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 07:40:43', '2020-06-11 15:38:38', 0, '[\"CAMERA\"]'),
(24, 'plastic-rag-bems0wj', 'PLASTIC RAG', 4, 'BNJ-00027-000023', 150, 'RFL,RFL', NULL, '{}', NULL, '[]', '[{\"title\":\"PLASTIC RAG\",\"description\":\"PLASTIC RAG\",\"descriptionImage\":\"11_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"11_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"12_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"11_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"12_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"11_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"12_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"11_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"12_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"11_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"12_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"11_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"12_2240x1680.png\",\"serialNumber\":\"12\"}]', '11_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 07:45:07', '2020-06-11 15:38:37', 0, '[\"PLASTIC RAG\"]'),
(25, 'painting-bens0hc', 'PAINTING', 4, 'BNJ-00027-000024', 700, 'LR,LR', NULL, '{}', NULL, '[]', '[{\"title\":\"PAINTING\",\"description\":\"PAINTING\",\"descriptionImage\":\"cocker-spaniel-drawing-62.jpg\"}]', 'yes', '[{\"imageName\":\"cocker-spaniel-drawing-62.png\",\"serialNumber\":\"3\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b.png\",\"serialNumber\":\"4\"},{\"imageName\":\"cocker-spaniel-drawing-62.png\",\"serialNumber\":\"5\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b.png\",\"serialNumber\":\"6\"},{\"imageName\":\"cocker-spaniel-drawing-62.png\",\"serialNumber\":\"7\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b.png\",\"serialNumber\":\"8\"},{\"imageName\":\"cocker-spaniel-drawing-62.png\",\"serialNumber\":\"9\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b.png\",\"serialNumber\":\"10\"},{\"imageName\":\"cocker-spaniel-drawing-62.png\",\"serialNumber\":\"11\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b.png\",\"serialNumber\":\"12\"}]', 'cocker-spaniel-drawing-62.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 07:54:52', '2020-06-11 15:38:37', 0, '[\"PAINTING\"]'),
(26, 'device-beos074', 'DEVICE', 4, 'BNJ-00027-000025', 1300, 'RL,RL', NULL, '{}', NULL, '[]', '[{\"title\":\"DEVICE\",\"description\":\"DEVICE\",\"descriptionImage\":\"20_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"20_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"20_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"20_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"20_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"20_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"12\"}]', '20_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 08:00:40', '2020-06-11 15:38:37', 0, '[]'),
(27, 'laptop-beps0wz', 'LAPTOP', 4, 'BNJ-00027-000026', 40000, 'LG,LG', NULL, '{}', NULL, '[]', '[{\"title\":\"LAPTOP\",\"description\":\"LAPTOP\",\"descriptionImage\":\"15_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"15_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"17_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"15_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"17_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"15_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"17_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"15_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"17_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"15_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"17_2240x1680.png\",\"serialNumber\":\"12\"}]', '15_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 08:37:57', '2020-06-11 15:38:37', 0, '[\"LAPTOP\"]'),
(28, 'device-1-beqs0hl', 'DEVICE-1', 4, 'BNJ-00027-000027', 1500, 'LR,LR', NULL, '{}', NULL, '[]', '[{\"title\":\"LAPTOP\",\"description\":\"LAPTOP\",\"descriptionImage\":\"17_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"17_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"15_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"17_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"15_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"17_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"15_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"17_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"15_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"17_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"15_2240x1680.png\",\"serialNumber\":\"12\"}]', '17_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 08:42:05', '2020-06-11 15:38:37', 0, '[\"LAPTOP\"]'),
(29, 'pin-bers03r', 'PIN', 4, 'BNJ-00027-000028', 100, 'RL', NULL, '{\"color\":[],\"size\":[]}', NULL, '[]', '[{\"title\":\"PIN\",\"description\":\"PIN\",\"descriptionImage\":\"wessex-ellard-canopy-roller-spindles-250-2240x1680_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"wessex-ellard-canopy-roller-spindles-250-2240x1680_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"wessex-ellard-canopy-roller-spindles-250-2240x1680_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"wessex-ellard-canopy-roller-spindles-250-2240x1680_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"wessex-ellard-canopy-roller-spindles-250-2240x1680_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"wessex-ellard-canopy-roller-spindles-250-2240x1680_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"12\"}]', 'wessex-ellard-canopy-roller-spindles-250-2240x1680_2240x1680.png', 27, 0, NULL, 'active', 'unauthorize', '2020-02-27 08:50:51', '2020-06-11 15:38:37', 0, '[]'),
(30, 'showpiece-3-bess0gh', 'SHOWPIECE-3', 4, 'BNJ-00027-000029', 180, 'LR,LR', NULL, '{}', NULL, '[]', '[{\"title\":\"SHOWPIECE-3\",\"description\":\"SHOWPIECE-3\",\"descriptionImage\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"cocker-spaniel-drawing-62_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"cocker-spaniel-drawing-62_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"cocker-spaniel-drawing-62_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"cocker-spaniel-drawing-62_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"cocker-spaniel-drawing-62_2240x1680.png\",\"serialNumber\":\"12\"}]', 'goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 08:56:23', '2020-06-11 15:38:37', 0, '[\"SHOWPIECE-3\"]'),
(31, 'book-bets0og', 'BOOK', 4, 'BNJ-00027-000030', 220, 'LR,LR', NULL, '{}', NULL, '[]', '[{\"title\":\"BOOK\",\"description\":\"BOOK\",\"descriptionImage\":\"27.JPG\"}]', 'yes', '[{\"imageName\":\"27.png\",\"serialNumber\":\"3\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"12\"}]', '27_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 09:09:37', '2020-06-11 15:38:37', 0, '[\"BOOK\"]'),
(32, 'painting-1-beus0r3', 'PAINTING-1', 4, 'BNJ-00027-000031', 300, 'LR LR', NULL, '{\"color\":[],\"size\":[]}', NULL, '[]', '[{\"title\":\"PAINTING-1\",\"description\":\"PAINTING-1\",\"descriptionImage\":\"1553301087397.jpg\"}]', 'yes', '[{\"imageName\":\"birds_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"17_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"cocker-spaniel-drawing-62_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"cocker-spaniel-drawing-62_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"cocker-spaniel-drawing-62_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"cocker-spaniel-drawing-62_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"cocker-spaniel-drawing-62_2240x1680.png\",\"serialNumber\":\"12\"}]', 'birds_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-02-27 09:22:25', '2020-06-11 15:38:37', 0, '[\"PAINTING-1\"]'),
(33, 'flower-bevs0in', 'FLOWER', 16, 'BNJ-00027-000032', 100, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"2\"]}', NULL, '[]', '[{\"title\":\"FLOWER\",\"description\":\"FLOWER\",\"descriptionImage\":\"211405_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"12\"}]', '211405_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 06:58:06', '2020-06-11 15:38:37', 0, '[\"FLOWER\"]'),
(34, 'juice-bews0wi', 'JUICE', 16, 'BNJ-00027-000033', 70, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"JUICE\",\"description\":\"JUICE\",\"descriptionImage\":\"2_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"2_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"12\"}]', '2_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 07:02:59', '2020-06-11 15:38:37', 0, '[\"JUICE\"]'),
(35, 'showpiece-bexs0gc', 'SHOWPIECE', 16, 'BNJ-00027-000034', 2600, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"SHOWPIECE\",\"description\":\"SHOWPIECE\",\"descriptionImage\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"12\"}]', '8b48782bf796ec6febd963c0288bd78b_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 07:31:16', '2020-06-11 15:38:37', 0, '[\"SHOWPIECE\"]'),
(36, 'showpiece-1-beys0fo', 'SHOWPIECE-1', 16, 'BNJ-00027-000035', 600, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"SHOWPIECE-1\",\"description\":\"SHOWPIECE-1\",\"descriptionImage\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"8b48782bf796ec6febd963c0288bd78b_2240x1680.png\",\"serialNumber\":\"12\"}]', '4ffaf0fb4648c5eb38aa28dfcce19a45_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 07:34:44', '2020-06-11 15:38:37', 0, '[\"SHOWPIECE-1\"]'),
(37, 'showpiece-3-bezs0n5', 'SHOWPIECE-3', 16, 'BNJ-00027-000036', 1200, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"SHOWPIECE-3\",\"description\":\"SHOWPIECE-3\",\"descriptionImage\":\"1553301087397_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"1553301087397_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"12\"}]', '1553301087397_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 07:44:44', '2020-06-11 15:38:37', 0, '[\"SHOWPIECE-3\"]'),
(38, 'showpiece-4-bf10s0rh', 'SHOWPIECE-4', 16, 'BNJ-00027-000037', 300, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"SHOWPIECE-4\",\"description\":\"SHOWPIECE-4\",\"descriptionImage\":\"IMG_8647-2240x1680_2240x1680.jpeg\"}]', 'yes', '[{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"12\"}]', 'IMG_8647-2240x1680_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 07:53:00', '2020-06-11 15:38:38', 0, '[\"SHOWPIECE-4\"]'),
(39, 'camera-bf11s0d9', 'CAMERA', 16, 'BNJ-00027-000038', 44995, 'CANON,CANON', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"CAMERA\",\"description\":\"CAMERA\",\"descriptionImage\":\"29_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"29_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"12\"}]', '29_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 07:56:11', '2020-06-11 15:38:37', 0, '[\"CAMERA\"]'),
(40, 'showpiece-2-bf12s0gk', 'SHOWPIECE-2', 16, 'BNJ-00027-000039', 400, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"SHOWPIECE-2\",\"description\":\"SHOWPIECE-2\",\"descriptionImage\":\"19016_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"19016_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"211405_2240x1680.png\",\"serialNumber\":\"12\"}]', '19016_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 08:23:35', '2020-06-11 15:38:38', 0, '[\"SHOWPIECE-2\"]'),
(41, 'history-book-bf13s0bi', 'HISTORY BOOK', 16, 'BNJ-00027-000040', 400, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"HISTORY BOOK\",\"description\":\"HISTORY BOOK\",\"descriptionImage\":\"hRp38qO_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"12\"}]', 'hRp38qO_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 08:37:09', '2020-06-11 15:38:37', 0, '[\"HISTORY BOOK\"]'),
(42, 'book-bf14s0nc', 'BOOK', 16, 'BNJ-00027-000041', 400, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"BOOK\",\"description\":\"BOOK\",\"descriptionImage\":\"27_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"27_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"12\"}]', '27_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 08:39:41', '2020-06-11 15:38:37', 0, '[\"BOOK\"]'),
(43, 'lamps-bf15s0i0', 'LAMPS', 23, 'BNJ-00027-000042', 700, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"LAMPS\",\"description\":\"LAMPS\",\"descriptionImage\":\"nnamed_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"goomba_cake_super_mario_bros_cake-2240x1680_2240x1680.png\",\"serialNumber\":\"12\"}]', 'nnamed_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 08:43:20', '2020-06-11 15:38:37', 0, '[\"LAMPS\"]'),
(44, 'paper-bf16s0vx', 'PAPER', 23, 'BNJ-00027-000043', 40, 'RL,RL', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"PAPER\",\"description\":\"PAPER\",\"descriptionImage\":\"images_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"images_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"hRp38qO_2240x1680.png\",\"serialNumber\":\"12\"}]', 'images_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 08:45:34', '2020-06-11 15:38:37', 0, '[\"PAPER\"]');
INSERT INTO `products_slug` (`id`, `slug`, `product_name`, `category_id`, `product_sku`, `productPrice`, `brand_name`, `product_specification_id`, `product_specification_name`, `product_specification_details`, `product_specification_details_description`, `product_full_description`, `qc_status`, `image`, `home_image`, `vendor_id`, `entry_by`, `entry_user_type`, `status`, `isApprove`, `created_date`, `updated_date`, `softDelete`, `metaTags`) VALUES
(45, 'bottle-bf17s0ii', 'BOTTLE', 23, 'BNJ-00027-000044', 70, 'RL,RL', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"BOTTLE\",\"description\":\"BOTTLE\",\"descriptionImage\":\"images1_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"images1_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"IMG_8647-2240x1680_2240x1680.png\",\"serialNumber\":\"12\"}]', 'images1_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 08:47:34', '2020-06-11 15:38:37', 0, '[\"BOTTLE\"]'),
(46, 'bike-bf18s0st', 'BIKE', 23, 'BNJ-00027-000045', 11990, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"BIKE\",\"description\":\"BIKE\",\"descriptionImage\":\"named_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"12\"}]', 'named_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 08:50:32', '2020-06-11 15:38:37', 0, '[\"BIKE\"]'),
(47, 'sunglass-bf19s0af', 'SUNGLASS', 23, 'BNJ-00027-000046', 250, 'RL,RL', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"SUNGLASS\",\"description\":\"SUNGLASS\",\"descriptionImage\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"nnamed_2240x1680.png\",\"serialNumber\":\"12\"}]', 'wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 08:52:39', '2020-06-11 15:38:37', 0, '[\"SUNGLASS\"]'),
(48, 'belt-bf1as025', 'BELT', 23, 'BNJ-00027-000047', 599, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"BELT\",\"description\":\"BELT\",\"descriptionImage\":\"unnamed_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"unnamed_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"wxhdech05-h-d-echo-light-adj-smoke-grey-gloss-black-frame-2240x1680_2240x1680.png\",\"serialNumber\":\"12\"}]', 'unnamed_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 08:54:41', '2020-06-11 15:38:37', 0, '[\"BELT\"]'),
(49, 'bike-2-bf1bs0gs', 'BIKE-2', 23, 'BNJ-00027-000048', 11990, 'RL,RL', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"BIKE-2\",\"description\":\"BIKE-2\",\"descriptionImage\":\"named1_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"named1_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"named_2240x1680.png\",\"serialNumber\":\"12\"}]', 'named1_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 08:59:44', '2020-06-11 15:38:37', 0, '[\"BIKE-2\"]'),
(50, 'guns-1-bf1cs097', 'GUNS-1', 23, 'BNJ-00027-000049', 1100, 'LR,LR', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"GUNS-1\",\"description\":\"GUNS-1\",\"descriptionImage\":\"10_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"10_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"10_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"10_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"10_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"10_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"12\"}]', '10_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 09:06:19', '2020-06-11 15:38:37', 0, '[\"GUNS-1\"]'),
(51, 'guns-2-bf1ds0kb', 'GUNS-2', 23, 'BNJ-00027-000050', 1200, 'RL,RL', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"GUNS-2\",\"description\":\"GUNS-2\",\"descriptionImage\":\"32_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"32_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"30_2240x1680.png\",\"serialNumber\":\"12\"}]', '32_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 09:10:07', '2020-06-11 15:38:37', 0, '[\"GUNS-2\"]'),
(52, 'basket-1-bf1es0v1', 'BASKET-1', 23, 'BNJ-00027-000051', 500, 'RL,RL', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"GREEN.jpg\"},{\"colorId\":5,\"imageName\":\"RED.jpg\"}],\"size\":[\"6\"]}', NULL, '[]', '[{\"title\":\"BASKET-1\",\"description\":\"BASKET-1\",\"descriptionImage\":\"5_2240x1680.jpg\"}]', 'yes', '[{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"5_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"6_2240x1680.png\",\"serialNumber\":\"12\"}]', '5_2240x1680.png', 27, 0, NULL, 'active', 'authorize', '2020-03-05 09:13:16', '2020-06-11 15:38:37', 0, '[\"BASKET-1\"]'),
(53, 'full-shirt-bf1fs0ix', 'Full Shirt', 24, 'BNJ-00033-00001', 1200, 'Test,Test', NULL, '{}', NULL, '[]', '[{\"title\":\"Full Shirt Description\",\"description\":\"\",\"descriptionImage\":\"41TOGKhEIJL.jpg\"}]', 'yes', '[{\"imageName\":\"1_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"41TxNIo3cQL_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"1_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"41TxNIo3cQL_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"1_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"41TxNIo3cQL_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"1_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"41TxNIo3cQL_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"1_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"41TxNIo3cQL_2240x1680.png\",\"serialNumber\":\"12\"}]', '1_2240x1680.png', 33, 0, NULL, 'active', 'authorize', '2020-04-02 11:34:59', '2020-06-11 15:38:37', 0, '[]'),
(54, 'full-shirt-02-bf1gs0wt', 'Full Shirt 02', 24, 'BNJ-00033-00002', 1200, 'Test,Test', NULL, '{}', NULL, '[]', '[{\"title\":\"Hello\",\"description\":\"\",\"descriptionImage\":\"Men-T-Shirt-Full-Sleeve-Size-Chart.jpg\"}]', 'yes', '[{\"imageName\":\"full-sleeve-shirt-03-aponzone-600x540_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"Liseaven-T-Shirt-Men-Cotton-T-Shirt-Full-Sleeve-tshirt-Men-Solid-Color-T-shirts-tops.jpg_640x640_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"full-sleeve-shirt-03-aponzone-600x540_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"Liseaven-T-Shirt-Men-Cotton-T-Shirt-Full-Sleeve-tshirt-Men-Solid-Color-T-shirts-tops.jpg_640x640_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"full-sleeve-shirt-03-aponzone-600x540_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"Liseaven-T-Shirt-Men-Cotton-T-Shirt-Full-Sleeve-tshirt-Men-Solid-Color-T-shirts-tops.jpg_640x640_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"full-sleeve-shirt-03-aponzone-600x540_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"Liseaven-T-Shirt-Men-Cotton-T-Shirt-Full-Sleeve-tshirt-Men-Solid-Color-T-shirts-tops.jpg_640x640_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"full-sleeve-shirt-03-aponzone-600x540_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"Liseaven-T-Shirt-Men-Cotton-T-Shirt-Full-Sleeve-tshirt-Men-Solid-Color-T-shirts-tops.jpg_640x640_2240x1680.png\",\"serialNumber\":\"12\"}]', 'full-sleeve-shirt-03-aponzone-600x540_2240x1680.png', 33, 0, NULL, 'active', 'authorize', '2020-04-02 11:36:51', '2020-06-11 15:38:37', 0, '[\"Full Shirt\"]'),
(55, 'half-pant-01-bf1hs0jp', 'Half Pant 01', 25, 'BNJ-00033-00003', 500, 'Test Pant,Test Pant', NULL, '{}', NULL, '[]', '[{\"title\":\"Test\",\"description\":\"\",\"descriptionImage\":\"Half Waist (cm).jpg\"}]', 'yes', '[{\"imageName\":\"hp74_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"mens-half-pant-500x500_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"hp74_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"mens-half-pant-500x500_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"hp74_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"mens-half-pant-500x500_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"hp74_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"mens-half-pant-500x500_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"hp74_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"mens-half-pant-500x500_2240x1680.png\",\"serialNumber\":\"12\"}]', 'hp74_2240x1680.png', 33, 0, NULL, 'active', 'authorize', '2020-04-02 11:38:53', '2020-06-11 15:38:37', 0, '[\"Half Pant\"]'),
(56, 'half-pant-02-bf1is07y', 'Half Pant 02', 25, 'BNJ-00033-00004', 600, 'Tets Pant,Tets Pant', NULL, '{}', NULL, '[]', '[{\"title\":\"Test Pant\",\"description\":\"\",\"descriptionImage\":\"Sizing_chart_Half_pant.jfif\"}]', 'yes', '[{\"imageName\":\"mens-half-pant-500x500_1_2240x1680.png\",\"serialNumber\":\"3\"},{\"imageName\":\"men-s-half-pant-500x500_2240x1680.png\",\"serialNumber\":\"4\"},{\"imageName\":\"mens-half-pant-500x500_1_2240x1680.png\",\"serialNumber\":\"5\"},{\"imageName\":\"men-s-half-pant-500x500_2240x1680.png\",\"serialNumber\":\"6\"},{\"imageName\":\"mens-half-pant-500x500_1_2240x1680.png\",\"serialNumber\":\"7\"},{\"imageName\":\"men-s-half-pant-500x500_2240x1680.png\",\"serialNumber\":\"8\"},{\"imageName\":\"mens-half-pant-500x500_1_2240x1680.png\",\"serialNumber\":\"9\"},{\"imageName\":\"men-s-half-pant-500x500_2240x1680.png\",\"serialNumber\":\"10\"},{\"imageName\":\"mens-half-pant-500x500_1_2240x1680.png\",\"serialNumber\":\"11\"},{\"imageName\":\"men-s-half-pant-500x500_2240x1680.png\",\"serialNumber\":\"12\"}]', 'mens-half-pant-500x500_1_2240x1680.png', 33, 0, NULL, 'active', 'unauthorize', '2020-04-02 11:40:42', '2020-06-11 15:38:37', 0, '[\"Half Pant\"]'),
(57, 'handi-craft-mehedi-001-bf1js087', 'handi-craft-mehedi-001', 4, 'BNJ-00071-00001', 2000, 'mehedi,mehedi', NULL, '{}', NULL, '[]', '[]', 'yes', '[{\"imageName\":\"handi-craft-mehedi-01.png\",\"serialNumber\":\"3\"},{\"imageName\":\"handi-craft-mehedi-02.png\",\"serialNumber\":\"4\"},{\"imageName\":\"handi-craft-mehedi-03.png\",\"serialNumber\":\"5\"},{\"imageName\":\"handi-craft-mehedi-04.png\",\"serialNumber\":\"6\"},{\"imageName\":\"handi-craft-mehedi-05.png\",\"serialNumber\":\"7\"}]', 'handi-craft-mehedi-01.png', 71, 0, NULL, 'active', 'authorize', '2020-05-18 04:48:26', '2020-06-11 15:38:37', 0, '[]'),
(58, 'full-pant-mehedi-001-bf1ks0g4', 'full-pant-mehedi-001', 23, 'BNJ-00071-00002', 3500, 'undefined', NULL, '{\"color\":[{\"colorId\":\"4\",\"imageName\":\"\"},{\"colorId\":\"5\",\"imageName\":\"\"},{\"colorId\":\"7\",\"imageName\":\"\"}],\"size\":[\"6\",\"7\"]}', NULL, '[]', '[{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"men-full-pant-mehedi-001.png\",\"serialNumber\":\"3\"},{\"imageName\":\"men-full-pant-mehedi-002.png\",\"serialNumber\":\"4\"},{\"imageName\":\"men-full-pant-mehedi-003.png\",\"serialNumber\":\"5\"},{\"imageName\":\"men-full-pant-mehedi-004.png\",\"serialNumber\":\"6\"},{\"imageName\":\"men-full-pant-mehedi-005.png\",\"serialNumber\":\"7\"}]', 'men-full-pant-mehedi-001.png', 71, 0, NULL, 'active', 'authorize', '2020-05-18 04:57:44', '2020-06-11 15:38:38', 0, '[]'),
(60, 'women-dress-mehedi-01-bf1ls006', 'women-dress-mehedi-01', 16, 'BNJ-00071-00004', 5000, 'undefined', NULL, '{\"color\":[{\"colorId\":4,\"imageName\":\"green-color.jpg\"},{\"colorId\":5,\"imageName\":\"red-color.jpg\"},{\"colorId\":7,\"imageName\":\"blue-color.jpg\"}],\"size\":[\"3\",\"6\",\"7\"]}', NULL, '[]', '[{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"women-mehedi-001-01.png\",\"serialNumber\":\"3\"},{\"imageName\":\"women-mehedi-001-02.png\",\"serialNumber\":\"4\"},{\"imageName\":\"women-mehedi-001-03.png\",\"serialNumber\":\"5\"},{\"imageName\":\"women-mehedi-001-04.png\",\"serialNumber\":\"6\"},{\"imageName\":\"women-mehedi-001-05.png\",\"serialNumber\":\"7\"}]', 'women-mehedi-001-01.png', 71, 0, NULL, 'active', 'authorize', '2020-05-18 05:41:12', '2020-06-11 15:38:37', 0, '[]'),
(61, 'women-dress-mehedi-02-bf1ms04x', 'women-dress-mehedi-02', 6, 'BNJ-00071-00005', 4500, 'undefined', NULL, '{}', NULL, '[]', '[{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"women-mehedi-002-01.png\",\"serialNumber\":\"3\"},{\"imageName\":\"women-mehedi-002-02.png\",\"serialNumber\":\"4\"},{\"imageName\":\"women-mehedi-002-03.png\",\"serialNumber\":\"5\"},{\"imageName\":\"women-mehedi-002-04.png\",\"serialNumber\":\"6\"},{\"imageName\":\"women-mehedi-002-05.png\",\"serialNumber\":\"7\"}]', 'women-mehedi-002-01.png', 71, 0, NULL, 'active', 'authorize', '2020-05-18 05:45:36', '2020-06-11 15:38:37', 0, '[]'),
(62, 'women-dress-mehedi-03-bf1ns00j', 'women-dress-mehedi-03', 6, 'BNJ-00071-00006', 4800, 'undefined', NULL, '{}', NULL, '[]', '[{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"women-mehedi-003-01.png\",\"serialNumber\":\"3\"},{\"imageName\":\"women-mehedi-003-02.png\",\"serialNumber\":\"4\"},{\"imageName\":\"women-mehedi-003-03.png\",\"serialNumber\":\"5\"},{\"imageName\":\"women-mehedi-003-04.png\",\"serialNumber\":\"6\"},{\"imageName\":\"women-mehedi-003-05.png\",\"serialNumber\":\"7\"}]', 'women-mehedi-003-01.png', 71, 0, NULL, 'active', 'authorize', '2020-05-18 05:49:37', '2020-06-11 15:38:37', 0, '[]'),
(63, 'ladies-bags-mehedi-001-bf1os00j', 'ladies-bags-mehedi-001', 5, 'BNJ-00071-00007', 7800, 'undefined', NULL, '{}', NULL, '[]', '[{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"leather-products-mehedi-001-01.png\",\"serialNumber\":\"3\"},{\"imageName\":\"leather-products-mehedi-001-04.png\",\"serialNumber\":\"6\"},{\"imageName\":\"leather-products-mehedi-001-05.png\",\"serialNumber\":\"7\"},{\"imageName\":\"leather-products-mehedi-001-02.png\",\"serialNumber\":\"4\"},{\"imageName\":\"leather-products-mehedi-001-03.png\",\"serialNumber\":\"5\"}]', 'leather-products-mehedi-001-01.png', 71, 0, NULL, 'active', 'authorize', '2020-05-18 05:56:35', '2020-06-11 15:38:37', 0, '[]'),
(64, 'leather-shoes-men-mehedi-01-bf1ps0rn', 'leather-shoes-men-mehedi-01', 5, 'BNJ-00071-00008', 12000, 'undefined', NULL, '{}', NULL, '[]', '[{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"leather-shoes-mehedi-001-01.png\",\"serialNumber\":\"3\"},{\"imageName\":\"leather-shoes-mehedi-001-02.png\",\"serialNumber\":\"4\"},{\"imageName\":\"leather-shoes-mehedi-001-03.png\",\"serialNumber\":\"5\"},{\"imageName\":\"leather-shoes-mehedi-001-04.png\",\"serialNumber\":\"6\"},{\"imageName\":\"leather-shoes-mehedi-001-05.png\",\"serialNumber\":\"7\"}]', 'leather-shoes-mehedi-001-01.png', 71, 0, NULL, 'active', 'authorize', '2020-05-18 06:00:39', '2020-06-11 15:38:37', 0, '[]'),
(65, 'leather-shoes-men-mehedi-02-bf1qs0te', 'leather-shoes-men-mehedi-02', 5, 'BNJ-00071-00009', 10000, 'undefined', NULL, '{}', NULL, '[]', '[{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"leather-shoes-mehedi-002-01.png\",\"serialNumber\":\"3\"},{\"imageName\":\"leather-shoes-mehedi-002-02.png\",\"serialNumber\":\"4\"},{\"imageName\":\"leather-shoes-mehedi-002-03.png\",\"serialNumber\":\"5\"},{\"imageName\":\"leather-shoes-mehedi-002-04.png\",\"serialNumber\":\"6\"},{\"imageName\":\"leather-shoes-mehedi-002-05.png\",\"serialNumber\":\"7\"}]', 'leather-shoes-mehedi-002-01.png', 71, 0, NULL, 'active', 'authorize', '2020-05-18 06:04:02', '2020-06-11 15:38:38', 0, '[]'),
(66, 'kids-dress-mehedi-001-bf1rs0wo', 'Kids Dress Mehedi 001', 7, 'BNJ-00071-000010', 4500, 'undefined', NULL, '{}', NULL, '[]', '[{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"kids-dress-mehedi-001-01.png\",\"serialNumber\":\"3\"},{\"imageName\":\"kids-dress-mehedi-001-02.png\",\"serialNumber\":\"4\"},{\"imageName\":\"kids-dress-mehedi-001-03.png\",\"serialNumber\":\"5\"},{\"imageName\":\"kids-dress-mehedi-001-04.png\",\"serialNumber\":\"6\"},{\"imageName\":\"kids-dress-mehedi-001-05.png\",\"serialNumber\":\"7\"}]', 'kids-dress-mehedi-001-01.png', 71, 0, NULL, 'active', 'authorize', '2020-05-18 06:08:12', '2020-06-11 15:38:37', 0, '[]'),
(67, 'full-shirt-men-mehedi-01-bf1ss0lp', 'Full Shirt Men Mehedi 01', 24, 'BNJ-00071-000011', 3500, 'undefined', NULL, '{}', NULL, '[]', '[{\"title\":\"\",\"description\":\"\",\"descriptionImage\":\"\"}]', 'yes', '[{\"imageName\":\"men-full-shirt-mehedi-001.png\",\"serialNumber\":\"3\"},{\"imageName\":\"men-full-shirt-mehedi-003.png\",\"serialNumber\":\"5\"},{\"imageName\":\"men-full-shirt-mehedi-004.png\",\"serialNumber\":\"6\"},{\"imageName\":\"men-full-shirt-mehedi-005.png\",\"serialNumber\":\"7\"}]', 'men-full-shirt-mehedi-001.png', 71, 0, NULL, 'active', 'authorize', '2020-05-18 06:18:32', '2020-06-11 15:38:37', 0, '[]');

-- --------------------------------------------------------

--
-- Table structure for table `product_discount`
--

CREATE TABLE `product_discount` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `discount_id` int(11) NOT NULL,
  `status` enum('active','deactive') NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `product_payment`
--

CREATE TABLE `product_payment` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `payment_amount` double NOT NULL,
  `payment_method` varchar(200) NOT NULL,
  `status` enum('active','deactive') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product_payment`
--

INSERT INTO `product_payment` (`id`, `customer_id`, `order_id`, `payment_amount`, `payment_method`, `status`) VALUES
(1, 88, 1, 5000, 'cash', 'active'),
(2, 88, 2, 5000, 'cash', 'active'),
(3, 88, 3, 10000, 'cash', 'active'),
(4, 88, 4, 5000, 'cash', 'active'),
(5, 88, 5, 5000, 'cash', 'active'),
(6, 88, 6, 20000, 'cash', 'active'),
(7, 67, 7, 5000, 'cash', 'active'),
(8, 94, 8, 6500, 'cash', 'active'),
(9, 94, 9, 5300, 'cash', 'active'),
(10, 94, 10, 5300, 'cash', 'active'),
(11, 94, 11, 5300, 'cash', 'active'),
(12, 94, 12, 5300, 'cash', 'active'),
(13, 94, 13, 5300, 'cash', 'active'),
(14, 94, 14, 5300, 'cash', 'active'),
(15, 94, 15, 5300, 'cash', 'active'),
(16, 94, 16, 5300, 'cash', 'active'),
(17, 94, 17, 5300, 'cash', 'active'),
(18, 94, 18, 5300, 'cash', 'active'),
(19, 94, 19, 5300, 'cash', 'active'),
(20, 94, 20, 5300, 'cash', 'active'),
(21, 94, 21, 6500, 'cash', 'active'),
(22, 94, 22, 6500, 'cash', 'active'),
(23, 94, 23, 6500, 'cash', 'active'),
(24, 94, 24, 6500, 'cash', 'active'),
(25, 94, 25, 6500, 'cash', 'active'),
(26, 94, 26, 6500, 'cash', 'active'),
(27, 94, 27, 6500, 'cash', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `product_specification_details`
--

CREATE TABLE `product_specification_details` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `specification_details_name` text NOT NULL,
  `entry_by` int(11) NOT NULL,
  `entry_user_type` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `softDel` tinyint(2) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `product_specification_details`
--

INSERT INTO `product_specification_details` (`id`, `category_id`, `specification_details_name`, `entry_by`, `entry_user_type`, `status`, `created_at`, `updated_at`, `softDel`) VALUES
(1, 16, '[\"Cotton\"]', 0, NULL, 'active', '2019-10-24 06:50:49', '2019-10-27 10:55:36', 1),
(2, 18, '[\"size\",\"chair type\"]', 0, NULL, 'active', '2019-10-28 06:48:11', '2019-12-01 07:52:26', 1),
(3, 15, '[\"Color\",\"Size\",\"Construction\"]', 0, NULL, 'active', '2019-12-01 11:29:34', '2019-12-28 08:51:52', 0),
(4, 21, '[]', 27, NULL, 'active', '2019-12-31 06:59:53', '2020-01-27 06:35:30', 1),
(5, 15, '[\"Construction\",\"material\",\"Size\",\"Color\",\"Weight\"]', 0, NULL, 'active', '2020-01-27 06:35:15', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `product_specification_names`
--

CREATE TABLE `product_specification_names` (
  `id` int(11) NOT NULL,
  `specification_name` varchar(200) NOT NULL,
  `category_id` int(11) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `softDel` tinyint(1) NOT NULL,
  `status` enum('active','deactive') NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_date` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product_specification_names`
--

INSERT INTO `product_specification_names` (`id`, `specification_name`, `category_id`, `type`, `softDel`, `status`, `created_date`, `updated_date`) VALUES
(24, 'Color', 16, 0, 0, 'active', '2020-01-20 03:25:53', NULL),
(25, 'Number', 16, 1, 0, 'active', '2020-01-20 03:26:09', NULL),
(26, 'Roman Number', 16, 3, 0, 'active', '2020-01-20 03:26:26', NULL),
(27, 'Color', 23, 0, 0, 'active', '2020-02-06 08:34:20', NULL),
(28, 'Roman Number', 23, 3, 0, 'active', '2020-02-06 08:34:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `promocode`
--

CREATE TABLE `promocode` (
  `id` int(11) NOT NULL,
  `promo_code` varchar(20) NOT NULL,
  `invoice_amount` double NOT NULL,
  `promo_amount` double NOT NULL,
  `promo_percantage` float NOT NULL,
  `effective_from` datetime NOT NULL,
  `effective_to` datetime NOT NULL,
  `isMultiple` enum('yes','no') NOT NULL,
  `times` smallint(2) NOT NULL DEFAULT 1,
  `vendor_id` int(11) NOT NULL,
  `softDel` tinyint(1) NOT NULL DEFAULT 0,
  `status` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `promocode`
--

INSERT INTO `promocode` (`id`, `promo_code`, `invoice_amount`, `promo_amount`, `promo_percantage`, `effective_from`, `effective_to`, `isMultiple`, `times`, `vendor_id`, `softDel`, `status`) VALUES
(1, 'BNJ001', 1000, 100, 50, '2019-12-01 06:00:00', '2019-12-31 00:00:00', 'no', 1, 32, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `sales_bill_no` varchar(50) NOT NULL,
  `sales_type` enum('cash','sslcommerz','dmoney') NOT NULL,
  `customer_id` int(11) NOT NULL,
  `sales_date` date NOT NULL,
  `total_sales_quantity` int(11) NOT NULL,
  `total_sales_amount` int(11) NOT NULL,
  `discount_amount` double NOT NULL DEFAULT 0,
  `promo_code` text DEFAULT NULL,
  `deliverStatus` enum('sold','ongoing','delivered') NOT NULL DEFAULT 'sold',
  `netAmount` float NOT NULL,
  `isEMI` tinyint(1) NOT NULL DEFAULT 0,
  `isConfirmed` enum('False','True') NOT NULL,
  `createdDate` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `softDel` tinyint(2) NOT NULL DEFAULT 0,
  `status` int(1) NOT NULL DEFAULT 1
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `sales_bill_no`, `sales_type`, `customer_id`, `sales_date`, `total_sales_quantity`, `total_sales_amount`, `discount_amount`, `promo_code`, `deliverStatus`, `netAmount`, `isEMI`, `isConfirmed`, `createdDate`, `softDel`, `status`) VALUES
(3, 'BNJ-2020-0000001', 'cash', 88, '2020-05-19', 2, 10000, 0, '[]', 'sold', 10000, 0, 'False', '2020-05-19 08:08:13', 0, 1),
(4, 'BNJ-2020-0000002', 'cash', 88, '2020-05-19', 1, 5000, 0, '[]', 'sold', 5000, 0, 'False', '2020-05-19 08:10:22', 0, 1),
(5, 'BNJ-2020-0000003', 'cash', 88, '2020-05-19', 1, 5000, 0, '[]', 'sold', 5000, 0, 'False', '2020-05-19 08:11:56', 0, 1),
(6, 'BNJ-2020-0000004', 'cash', 88, '2020-05-19', 4, 20000, 0, '[]', 'sold', 20000, 0, 'False', '2020-05-19 08:18:10', 0, 1),
(7, 'BNJ-2020-0000005', 'cash', 67, '2020-05-20', 1, 5000, 0, '[]', 'sold', 5000, 0, 'False', '2020-05-20 04:03:48', 0, 1),
(8, 'BNJ-2020-0000006', 'cash', 94, '2020-07-27', 3, 6500, 0, '[]', 'sold', 6500, 0, 'False', '2020-07-27 13:20:24', 0, 1),
(9, 'BNJ-2020-0000007', 'cash', 94, '2020-07-27', 2, 5300, 0, '[]', 'sold', 5300, 0, 'False', '2020-07-27 13:20:33', 0, 1),
(10, 'BNJ-2020-0000008', 'cash', 94, '2020-07-27', 2, 5300, 0, '[]', 'sold', 5300, 0, 'False', '2020-07-27 13:22:04', 0, 1),
(11, 'BNJ-2020-0000009', 'cash', 94, '2020-07-27', 2, 5300, 0, '[]', 'sold', 5300, 0, 'False', '2020-07-27 13:24:26', 0, 1),
(12, 'BNJ-2020-0000010', 'cash', 94, '2020-07-27', 2, 5300, 0, '[]', 'sold', 5300, 0, 'False', '2020-07-27 13:36:31', 0, 1),
(13, 'BNJ-2020-0000011', 'cash', 94, '2020-07-27', 2, 5300, 0, '[]', 'sold', 5300, 0, 'False', '2020-07-27 13:36:32', 0, 1),
(14, 'BNJ-2020-0000012', 'cash', 94, '2020-07-27', 2, 5300, 0, '[]', 'sold', 5300, 0, 'False', '2020-07-27 13:37:33', 0, 1),
(15, 'BNJ-2020-0000013', 'cash', 94, '2020-07-27', 2, 5300, 0, '[]', 'sold', 5300, 0, 'False', '2020-07-27 13:37:50', 0, 1),
(16, 'BNJ-2020-0000014', 'cash', 94, '2020-07-27', 2, 5300, 0, '[]', 'sold', 5300, 0, 'False', '2020-07-27 13:38:39', 0, 1),
(17, 'BNJ-2020-0000015', 'cash', 94, '2020-07-27', 2, 5300, 0, '[]', 'sold', 5300, 0, 'False', '2020-07-27 13:38:57', 0, 1),
(18, 'BNJ-2020-0000016', 'cash', 94, '2020-07-27', 2, 5300, 0, '[]', 'sold', 5300, 0, 'False', '2020-07-27 13:40:00', 0, 1),
(19, 'BNJ-2020-0000017', 'cash', 94, '2020-07-27', 2, 5300, 0, '[]', 'sold', 5300, 0, 'False', '2020-07-27 13:40:20', 0, 1),
(20, 'BNJ-2020-0000018', 'cash', 94, '2020-07-27', 2, 5300, 0, '[]', 'sold', 5300, 0, 'False', '2020-07-27 13:41:27', 0, 1),
(21, 'BNJ-2020-0000019', 'cash', 94, '2020-07-28', 3, 6500, 0, '[]', 'sold', 6500, 0, 'False', '2020-07-28 04:32:34', 0, 1),
(22, 'BNJ-2020-0000020', 'cash', 94, '2020-07-28', 3, 6500, 0, '[]', 'sold', 6500, 0, 'False', '2020-07-28 04:52:47', 0, 1),
(23, 'BNJ-2020-0000021', 'cash', 94, '2020-07-28', 3, 6500, 0, '[]', 'sold', 6500, 0, 'False', '2020-07-28 04:53:49', 0, 1),
(24, 'BNJ-2020-0000022', 'cash', 94, '2020-07-28', 3, 6500, 0, '[]', 'sold', 6500, 0, 'False', '2020-07-28 05:00:29', 0, 1),
(25, 'BNJ-2020-0000023', 'cash', 94, '2020-07-28', 3, 6500, 0, '[]', 'sold', 6500, 0, 'False', '2020-07-28 05:02:37', 0, 1),
(26, 'BNJ-2020-0000024', 'cash', 94, '2020-07-28', 3, 6500, 0, '[]', 'sold', 6500, 0, 'False', '2020-07-28 05:04:59', 0, 1),
(27, 'BNJ-2020-0000025', 'cash', 94, '2020-07-28', 3, 6500, 0, '[]', 'sold', 6500, 0, 'False', '2020-07-28 05:05:01', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `sales_details`
--

CREATE TABLE `sales_details` (
  `id` int(11) NOT NULL,
  `customerId` int(11) NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `salesBillId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `colorId` int(11) NOT NULL,
  `sizeId` int(11) NOT NULL,
  `sales_product_quantity` int(11) NOT NULL,
  `unitPrice` int(11) NOT NULL,
  `total_amount` int(11) NOT NULL,
  `customer_payable_amount` double NOT NULL,
  `deliveryCharge` int(11) DEFAULT NULL,
  `comission_amount` double DEFAULT NULL,
  `vendor_payable_amount` double DEFAULT NULL,
  `isAcceptedByVendor` enum('False','True') NOT NULL,
  `chalan_no` varchar(255) DEFAULT NULL,
  `discounts_amount` float DEFAULT 0,
  `delivery_status` enum('sold','processing','delivered','rejected') DEFAULT NULL,
  `delivery_date` datetime DEFAULT NULL,
  `vat` float NOT NULL DEFAULT 0,
  `tax` float NOT NULL DEFAULT 0,
  `status` int(1) NOT NULL DEFAULT 1
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sales_details`
--

INSERT INTO `sales_details` (`id`, `customerId`, `vendor_id`, `salesBillId`, `productId`, `colorId`, `sizeId`, `sales_product_quantity`, `unitPrice`, `total_amount`, `customer_payable_amount`, `deliveryCharge`, `comission_amount`, `vendor_payable_amount`, `isAcceptedByVendor`, `chalan_no`, `discounts_amount`, `delivery_status`, `delivery_date`, `vat`, `tax`, `status`) VALUES
(1, 88, 0, 1, 60, 4, 3, 1, 5000, 5000, 5000, NULL, NULL, NULL, 'False', NULL, 0, NULL, NULL, 0, 0, 1),
(2, 88, 0, 2, 60, 4, 3, 1, 5000, 5000, 5000, NULL, NULL, NULL, 'False', NULL, 0, NULL, NULL, 0, 0, 1),
(3, 88, 0, 3, 60, 4, 3, 2, 5000, 10000, 10000, NULL, NULL, NULL, 'False', NULL, 0, NULL, NULL, 0, 0, 1),
(4, 88, 0, 4, 60, 4, 3, 1, 5000, 5000, 5000, NULL, NULL, NULL, 'False', NULL, 0, NULL, NULL, 0, 0, 1),
(5, 88, 0, 5, 60, 4, 3, 1, 5000, 5000, 5000, NULL, NULL, NULL, 'False', NULL, 0, NULL, NULL, 0, 0, 1),
(6, 67, 0, 7, 60, 4, 3, 1, 5000, 5000, 5000, NULL, NULL, NULL, 'False', NULL, 0, NULL, NULL, 0, 0, 1),
(7, 94, 0, 8, 37, 5, 6, 1, 1200, 1200, 1200, NULL, NULL, NULL, 'False', NULL, 0, NULL, NULL, 0, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `sales_return`
--

CREATE TABLE `sales_return` (
  `id` int(11) NOT NULL,
  `salesReturnBillNo` varchar(255) NOT NULL,
  `salesBillId` int(11) NOT NULL,
  `customerId` int(11) NOT NULL,
  `salesDate` date NOT NULL,
  `salesReturnDate` date NOT NULL,
  `totalSalesReturnQuantity` int(11) NOT NULL,
  `totalSalesReturnAmount` int(11) NOT NULL,
  `totalSalesPayAmount` int(11) NOT NULL,
  `salesReturnPayAmount` int(11) NOT NULL,
  `createdDate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `softDel` tinyint(2) NOT NULL,
  `status` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `sales_return_details`
--

CREATE TABLE `sales_return_details` (
  `id` int(11) NOT NULL,
  `salesReturnId` int(11) NOT NULL,
  `salesReturnDate` date NOT NULL,
  `productId` int(11) NOT NULL,
  `salesReturnQuantity` int(11) NOT NULL,
  `costPrice` int(11) NOT NULL,
  `productSalesPrice` int(11) NOT NULL,
  `totalAmount` int(11) NOT NULL,
  `returnAmount` int(11) NOT NULL,
  `salesDate` date NOT NULL,
  `createdDate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `size_infos`
--

CREATE TABLE `size_infos` (
  `id` int(11) NOT NULL,
  `size` varchar(255) NOT NULL,
  `size_type_id` int(11) NOT NULL,
  `softDel` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `size_infos`
--

INSERT INTO `size_infos` (`id`, `size`, `size_type_id`, `softDel`, `status`) VALUES
(1, '12', 1, 1, 0),
(2, '12', 1, 0, 1),
(3, 'XII', 3, 0, 1),
(4, '11', 1, 0, 1),
(5, '1', 4, 0, 1),
(6, 'Xl', 3, 0, 1),
(7, 'X', 3, 0, 1),
(10, '15', 1, 0, 1),
(11, 'xl', 5, 0, 1),
(12, 's, m, xl, xxl', 5, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `size_type`
--

CREATE TABLE `size_type` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `softDel` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `size_type`
--

INSERT INTO `size_type` (`id`, `name`, `softDel`, `status`) VALUES
(1, 'Number', 0, 1),
(2, 'gg', 1, 0),
(3, 'Roman Number', 0, 1),
(4, 'Weight', 0, 1),
(5, 'Size', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `stock`
--

CREATE TABLE `stock` (
  `id` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `colorId` int(11) DEFAULT 0,
  `sizeId` int(11) DEFAULT 0,
  `quantity` int(11) NOT NULL,
  `vendorId` int(11) NOT NULL,
  `softDel` tinyint(4) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `createdBy` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stock`
--

INSERT INTO `stock` (`id`, `productId`, `colorId`, `sizeId`, `quantity`, `vendorId`, `softDel`, `status`, `createdBy`, `createdAt`) VALUES
(1, 37, 4, 3, 10, 27, 0, 1, 0, '0000-00-00 00:00:00'),
(2, 37, 5, 6, 10, 27, 0, 1, 0, '0000-00-00 00:00:00'),
(3, 37, 4, 7, 10, 27, 0, 1, 0, '0000-00-00 00:00:00'),
(4, 37, 4, 3, -2, 27, 0, 1, 0, '0000-00-00 00:00:00'),
(5, 37, 5, 6, -2, 27, 0, 1, 0, '0000-00-00 00:00:00'),
(8, 58, 4, 6, 5, 71, 0, 1, 71, '0000-00-00 00:00:00'),
(9, 60, 0, 0, 5, 71, 0, 1, 71, '0000-00-00 00:00:00'),
(10, 61, 0, 0, 5, 71, 0, 1, 71, '0000-00-00 00:00:00'),
(12, 63, 0, 0, 5, 71, 0, 1, 71, '0000-00-00 00:00:00'),
(13, 64, 0, 0, 5, 71, 0, 1, 71, '0000-00-00 00:00:00'),
(14, 65, 0, 0, 5, 71, 0, 1, 71, '0000-00-00 00:00:00'),
(15, 66, 0, 0, 5, 71, 0, 1, 71, '0000-00-00 00:00:00'),
(16, 67, 0, 0, 5, 71, 0, 1, 71, '0000-00-00 00:00:00'),
(18, 60, 4, 3, -1, 71, 0, 1, 67, '2020-05-20 04:03:48'),
(19, 37, 5, 6, -1, 27, 0, 1, 94, '2020-07-27 13:20:24');

-- --------------------------------------------------------

--
-- Table structure for table `temp_sell`
--

CREATE TABLE `temp_sell` (
  `id` int(11) NOT NULL,
  `customerId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `colorId` int(11) NOT NULL DEFAULT 0,
  `sizeId` int(11) NOT NULL DEFAULT 0,
  `status` enum('initial','delivered') NOT NULL DEFAULT 'initial',
  `create_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `temp_sell`
--

INSERT INTO `temp_sell` (`id`, `customerId`, `productId`, `colorId`, `sizeId`, `status`, `create_date`, `updated_date`, `quantity`) VALUES
(9, 88, 60, 4, 3, 'initial', '2020-05-19 08:17:58', '2020-05-19 08:17:58', 1),
(11, 67, 60, 4, 3, 'initial', '2020-05-20 04:06:48', '2020-05-20 04:06:48', 1),
(12, 89, 37, 5, 6, 'initial', '2020-07-16 03:50:01', '2020-07-16 03:50:01', 2),
(14, 94, 32, 3, 4, 'initial', '2020-07-22 10:16:15', '2020-07-22 10:16:15', 1),
(15, 94, 60, 0, 0, 'initial', '2020-07-26 04:19:44', '2020-07-26 04:19:44', 1),
(16, 94, 37, 5, 6, 'initial', '2020-07-28 03:30:11', '2020-07-28 03:30:11', 1),
(17, 94, 65, 0, 0, 'initial', '2020-07-28 04:31:35', '2020-07-28 04:31:35', 0);

-- --------------------------------------------------------

--
-- Table structure for table `terms_conditions`
--

CREATE TABLE `terms_conditions` (
  `id` int(11) NOT NULL,
  `terms_and_conditions` text NOT NULL,
  `condition_type_id` int(11) NOT NULL,
  `softDel` tinyint(2) NOT NULL,
  `status` tinyint(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `terms_conditions`
--

INSERT INTO `terms_conditions` (`id`, `terms_and_conditions`, `condition_type_id`, `softDel`, `status`) VALUES
(2, 'sadadd asdads sadsad asdsd ertrtrtet retter', 1, 0, 1),
(3, 'Welcome to the banijjo.com.bd website (the \"Site\") operated by banijjo Bangladesh Ltd. We respect your privacy and want to protect your personal information. To learn more, please read this Privacy Policy.\r\nThis Privacy Policy explains how we collect, use and (under certain conditions) disclose your personal information. This Privacy Policy also explains the steps we have taken to secure your personal information. Finally, this Privacy Policy explains your options regarding the collection, use and disclosure of your personal information. By visiting the Site directly or through another site, you accept the practices described in this Policy.\r\nData protection is a matter of trust and your privacy is important to us. We shall therefore only use your name and other information which relates to you in the manner set out in this Privacy Policy. We will only collect information where it is necessary for us to do so and we will only collect information if it is relevant to our dealings with you.\r\nWe will only keep your information for as long as we are either required to by law or as is relevant for the purposes for which it was collected.\r\nYou can visit the Site and browse without having to provide personal details. During your visit to the Site you remain anonymous and at no time can we identify you unless you have an account on the Site and log on with your user name and password.\r\n\r\n1. Data that we collect\r\nWe may collect various pieces of information if you seek to place an order for a product with us on the Site.\r\nWe collect, store and process your data for processing your purchase on the Site and any possible later claims, and to provide you with our services. We may collect personal information including, but not limited to, your title, name, gender, date of birth, email address, postal address, delivery address (if different), telephone number, mobile number, fax number, payment details, payment card details or bank account details.\r\n\r\nOther uses of your Personal Information\r\nWe may use your personal information for opinion and market research. Your details are anonymous and will only be used for statistical purposes. You can choose to opt out of this at any time. Any answers to surveys or opinion polls we may ask you to complete will not be forwarded on to third parties. Disclosing your email address is only necessary if you would like to take part in competitions. We save the answers to our surveys separately from your email address.\r\n\r\nCompetitions\r\nFor any competition we use the data to notify winners and advertise our offers. You can find more details where applicable in our participation terms for the respective competition.', 2, 0, 1),
(4, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Non consectetur a erat nam at. Eleifend donec pretium vulputate sapien nec sagittis. Quisque egestas diam in arcu cursus euismod. Quisque egestas diam in arcu. Nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum. Est sit amet facilisis magna. Iaculis urna id volutpat lacus. Non nisi est sit amet facilisis magna etiam tempor. Diam sit amet nisl suscipit adipiscing bibendum est. Ac tortor vitae purus faucibus ornare suspendisse. Ut diam quam nulla porttitor massa id neque aliquam. Amet cursus sit amet dictum sit amet justo donec. Massa tempor nec feugiat nisl pretium fusce id velit ut. Sollicitudin aliquam ultrices sagittis orci a scelerisque purus semper. Cras fermentum odio eu feugiat pretium nibh ipsum consequat.\r\n\r\nMollis aliquam ut porttitor leo a diam sollicitudin tempor. Consequat nisl vel pretium lectus quam id leo in. Accumsan lacus vel facilisis volutpat est velit egestas dui. Mi in nulla posuere sollicitudin aliquam. Nulla at volutpat diam ut. At imperdiet dui accumsan sit amet nulla facilisi morbi. Aenean sed adipiscing diam donec adipiscing tristique risus nec feugiat. Mus mauris vitae ultricies leo integer malesuada nunc vel. Lorem ipsum dolor sit amet consectetur adipiscing elit ut. Dignissim sodales ut eu sem integer vitae. Facilisi cras fermentum odio eu feugiat. Sed viverra tellus in hac habitasse platea dictumst vestibulum. Duis ultricies lacus sed turpis. Faucibus pulvinar elementum integer enim neque volutpat ac tincidunt vitae. Enim sit amet venenatis urna cursus eget nunc scelerisque. Suspendisse potenti nullam ac tortor vitae. Scelerisque eleifend donec pretium vulputate sapien nec sagittis. Dolor sit amet consectetur adipiscing elit ut aliquam. Sodales ut etiam sit amet nisl purus in mollis. Ultricies mi eget mauris pharetra et ultrices.\r\n\r\nCondimentum vitae sapien pellentesque habitant morbi tristique senectus. Ut lectus arcu bibendum at varius vel pharetra. Facilisi morbi tempus iaculis urna id volutpat lacus. Mauris vitae ultricies leo integer malesuada nunc vel risus commodo. Quis vel eros donec ac odio tempor orci. Sed vulputate mi sit amet. Consectetur adipiscing elit ut aliquam purus. Velit egestas dui id ornare arcu odio. Elementum eu facilisis sed odio morbi quis commodo. At tempor commodo ullamcorper a. Tristique senectus et netus et malesuada fames. Sit amet tellus cras adipiscing enim eu turpis egestas pretium. In pellentesque massa placerat duis ultricies.\r\n\r\nVelit egestas dui id ornare arcu odio. Tristique magna sit amet purus gravida quis blandit turpis. Elementum tempus egestas sed sed. Viverra aliquet eget sit amet tellus cras adipiscing enim. Dictum sit amet justo donec enim diam vulputate ut. Sed enim ut sem viverra. Justo laoreet sit amet cursus sit amet dictum sit. Risus sed vulputate odio ut enim blandit volutpat maecenas volutpat. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Viverra nibh cras pulvinar mattis nunc sed. Sem nulla pharetra diam sit amet nisl suscipit adipiscing bibendum. Proin libero nunc consequat interdum varius. Pellentesque elit eget gravida cum sociis natoque. Donec enim diam vulputate ut pharetra sit amet. Volutpat est velit egestas dui id ornare arcu odio ut. Duis convallis convallis tellus id interdum velit laoreet.\r\n\r\nHabitant morbi tristique senectus et netus et malesuada fames ac. Lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi. Fermentum iaculis eu non diam phasellus vestibulum lorem sed. Mollis nunc sed id semper risus in. Aliquam sem et tortor consequat id. Orci porta non pulvinar neque. Maecenas volutpat blandit aliquam etiam erat. Suspendisse in est ante in nibh. Arcu felis bibendum ut tristique et. In ornare quam viverra orci.', 3, 0, 1),
(5, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Non consectetur a erat nam at. Eleifend donec pretium vulputate sapien nec sagittis. Quisque egestas diam in arcu cursus euismod. Quisque egestas diam in arcu. Nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum. Est sit amet facilisis magna. Iaculis urna id volutpat lacus. Non nisi est sit amet facilisis magna etiam tempor. Diam sit amet nisl suscipit adipiscing bibendum est. Ac tortor vitae purus faucibus ornare suspendisse. Ut diam quam nulla porttitor massa id neque aliquam. Amet cursus sit amet dictum sit amet justo donec. Massa tempor nec feugiat nisl pretium fusce id velit ut. Sollicitudin aliquam ultrices sagittis orci a scelerisque purus semper. Cras fermentum odio eu feugiat pretium nibh ipsum consequat.\r\n\r\nMollis aliquam ut porttitor leo a diam sollicitudin tempor. Consequat nisl vel pretium lectus quam id leo in. Accumsan lacus vel facilisis volutpat est velit egestas dui. Mi in nulla posuere sollicitudin aliquam. Nulla at volutpat diam ut. At imperdiet dui accumsan sit amet nulla facilisi morbi. Aenean sed adipiscing diam donec adipiscing tristique risus nec feugiat. Mus mauris vitae ultricies leo integer malesuada nunc vel. Lorem ipsum dolor sit amet consectetur adipiscing elit ut. Dignissim sodales ut eu sem integer vitae. Facilisi cras fermentum odio eu feugiat. Sed viverra tellus in hac habitasse platea dictumst vestibulum. Duis ultricies lacus sed turpis. Faucibus pulvinar elementum integer enim neque volutpat ac tincidunt vitae. Enim sit amet venenatis urna cursus eget nunc scelerisque. Suspendisse potenti nullam ac tortor vitae. Scelerisque eleifend donec pretium vulputate sapien nec sagittis. Dolor sit amet consectetur adipiscing elit ut aliquam. Sodales ut etiam sit amet nisl purus in mollis. Ultricies mi eget mauris pharetra et ultrices.\r\n\r\nCondimentum vitae sapien pellentesque habitant morbi tristique senectus. Ut lectus arcu bibendum at varius vel pharetra. Facilisi morbi tempus iaculis urna id volutpat lacus. Mauris vitae ultricies leo integer malesuada nunc vel risus commodo. Quis vel eros donec ac odio tempor orci. Sed vulputate mi sit amet. Consectetur adipiscing elit ut aliquam purus. Velit egestas dui id ornare arcu odio. Elementum eu facilisis sed odio morbi quis commodo. At tempor commodo ullamcorper a. Tristique senectus et netus et malesuada fames. Sit amet tellus cras adipiscing enim eu turpis egestas pretium. In pellentesque massa placerat duis ultricies.\r\n\r\nVelit egestas dui id ornare arcu odio. Tristique magna sit amet purus gravida quis blandit turpis. Elementum tempus egestas sed sed. Viverra aliquet eget sit amet tellus cras adipiscing enim. Dictum sit amet justo donec enim diam vulputate ut. Sed enim ut sem viverra. Justo laoreet sit amet cursus sit amet dictum sit. Risus sed vulputate odio ut enim blandit volutpat maecenas volutpat. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Viverra nibh cras pulvinar mattis nunc sed. Sem nulla pharetra diam sit amet nisl suscipit adipiscing bibendum. Proin libero nunc consequat interdum varius. Pellentesque elit eget gravida cum sociis natoque. Donec enim diam vulputate ut pharetra sit amet. Volutpat est velit egestas dui id ornare arcu odio ut. Duis convallis convallis tellus id interdum velit laoreet.\r\n\r\nHabitant morbi tristique senectus et netus et malesuada fames ac. Lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi. Fermentum iaculis eu non diam phasellus vestibulum lorem sed. Mollis nunc sed id semper risus in. Aliquam sem et tortor consequat id. Orci porta non pulvinar neque. Maecenas volutpat blandit aliquam etiam erat. Suspendisse in est ante in nibh. Arcu felis bibendum ut tristique et. In ornare quam viverra orci.', 4, 0, 1),
(6, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Non consectetur a erat nam at. Eleifend donec pretium vulputate sapien nec sagittis. Quisque egestas diam in arcu cursus euismod. Quisque egestas diam in arcu. Nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum. Est sit amet facilisis magna. Iaculis urna id volutpat lacus. Non nisi est sit amet facilisis magna etiam tempor. Diam sit amet nisl suscipit adipiscing bibendum est. Ac tortor vitae purus faucibus ornare suspendisse. Ut diam quam nulla porttitor massa id neque aliquam. Amet cursus sit amet dictum sit amet justo donec. Massa tempor nec feugiat nisl pretium fusce id velit ut. Sollicitudin aliquam ultrices sagittis orci a scelerisque purus semper. Cras fermentum odio eu feugiat pretium nibh ipsum consequat.\r\n\r\nMollis aliquam ut porttitor leo a diam sollicitudin tempor. Consequat nisl vel pretium lectus quam id leo in. Accumsan lacus vel facilisis volutpat est velit egestas dui. Mi in nulla posuere sollicitudin aliquam. Nulla at volutpat diam ut. At imperdiet dui accumsan sit amet nulla facilisi morbi. Aenean sed adipiscing diam donec adipiscing tristique risus nec feugiat. Mus mauris vitae ultricies leo integer malesuada nunc vel. Lorem ipsum dolor sit amet consectetur adipiscing elit ut. Dignissim sodales ut eu sem integer vitae. Facilisi cras fermentum odio eu feugiat. Sed viverra tellus in hac habitasse platea dictumst vestibulum. Duis ultricies lacus sed turpis. Faucibus pulvinar elementum integer enim neque volutpat ac tincidunt vitae. Enim sit amet venenatis urna cursus eget nunc scelerisque. Suspendisse potenti nullam ac tortor vitae. Scelerisque eleifend donec pretium vulputate sapien nec sagittis. Dolor sit amet consectetur adipiscing elit ut aliquam. Sodales ut etiam sit amet nisl purus in mollis. Ultricies mi eget mauris pharetra et ultrices.\r\n\r\nCondimentum vitae sapien pellentesque habitant morbi tristique senectus. Ut lectus arcu bibendum at varius vel pharetra. Facilisi morbi tempus iaculis urna id volutpat lacus. Mauris vitae ultricies leo integer malesuada nunc vel risus commodo. Quis vel eros donec ac odio tempor orci. Sed vulputate mi sit amet. Consectetur adipiscing elit ut aliquam purus. Velit egestas dui id ornare arcu odio. Elementum eu facilisis sed odio morbi quis commodo. At tempor commodo ullamcorper a. Tristique senectus et netus et malesuada fames. Sit amet tellus cras adipiscing enim eu turpis egestas pretium. In pellentesque massa placerat duis ultricies.\r\n\r\nVelit egestas dui id ornare arcu odio. Tristique magna sit amet purus gravida quis blandit turpis. Elementum tempus egestas sed sed. Viverra aliquet eget sit amet tellus cras adipiscing enim. Dictum sit amet justo donec enim diam vulputate ut. Sed enim ut sem viverra. Justo laoreet sit amet cursus sit amet dictum sit. Risus sed vulputate odio ut enim blandit volutpat maecenas volutpat. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Viverra nibh cras pulvinar mattis nunc sed. Sem nulla pharetra diam sit amet nisl suscipit adipiscing bibendum. Proin libero nunc consequat interdum varius. Pellentesque elit eget gravida cum sociis natoque. Donec enim diam vulputate ut pharetra sit amet. Volutpat est velit egestas dui id ornare arcu odio ut. Duis convallis convallis tellus id interdum velit laoreet.\r\n\r\nHabitant morbi tristique senectus et netus et malesuada fames ac. Lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi. Fermentum iaculis eu non diam phasellus vestibulum lorem sed. Mollis nunc sed id semper risus in. Aliquam sem et tortor consequat id. Orci porta non pulvinar neque. Maecenas volutpat blandit aliquam etiam erat. Suspendisse in est ante in nibh. Arcu felis bibendum ut tristique et. In ornare quam viverra orci.', 5, 0, 0),
(7, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Non consectetur a erat nam at. Eleifend donec pretium vulputate sapien nec sagittis. Quisque egestas diam in arcu cursus euismod. Quisque egestas diam in arcu. Nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum. Est sit amet facilisis magna. Iaculis urna id volutpat lacus. Non nisi est sit amet facilisis magna etiam tempor. Diam sit amet nisl suscipit adipiscing bibendum est. Ac tortor vitae purus faucibus ornare suspendisse. Ut diam quam nulla porttitor massa id neque aliquam. Amet cursus sit amet dictum sit amet justo donec. Massa tempor nec feugiat nisl pretium fusce id velit ut. Sollicitudin aliquam ultrices sagittis orci a scelerisque purus semper. Cras fermentum odio eu feugiat pretium nibh ipsum consequat.\r\n\r\nMollis aliquam ut porttitor leo a diam sollicitudin tempor. Consequat nisl vel pretium lectus quam id leo in. Accumsan lacus vel facilisis volutpat est velit egestas dui. Mi in nulla posuere sollicitudin aliquam. Nulla at volutpat diam ut. At imperdiet dui accumsan sit amet nulla facilisi morbi. Aenean sed adipiscing diam donec adipiscing tristique risus nec feugiat. Mus mauris vitae ultricies leo integer malesuada nunc vel. Lorem ipsum dolor sit amet consectetur adipiscing elit ut. Dignissim sodales ut eu sem integer vitae. Facilisi cras fermentum odio eu feugiat. Sed viverra tellus in hac habitasse platea dictumst vestibulum. Duis ultricies lacus sed turpis. Faucibus pulvinar elementum integer enim neque volutpat ac tincidunt vitae. Enim sit amet venenatis urna cursus eget nunc scelerisque. Suspendisse potenti nullam ac tortor vitae. Scelerisque eleifend donec pretium vulputate sapien nec sagittis. Dolor sit amet consectetur adipiscing elit ut aliquam. Sodales ut etiam sit amet nisl purus in mollis. Ultricies mi eget mauris pharetra et ultrices.\r\n\r\nCondimentum vitae sapien pellentesque habitant morbi tristique senectus. Ut lectus arcu bibendum at varius vel pharetra. Facilisi morbi tempus iaculis urna id volutpat lacus. Mauris vitae ultricies leo integer malesuada nunc vel risus commodo. Quis vel eros donec ac odio tempor orci. Sed vulputate mi sit amet. Consectetur adipiscing elit ut aliquam purus. Velit egestas dui id ornare arcu odio. Elementum eu facilisis sed odio morbi quis commodo. At tempor commodo ullamcorper a. Tristique senectus et netus et malesuada fames. Sit amet tellus cras adipiscing enim eu turpis egestas pretium. In pellentesque massa placerat duis ultricies.\r\n\r\nVelit egestas dui id ornare arcu odio. Tristique magna sit amet purus gravida quis blandit turpis. Elementum tempus egestas sed sed. Viverra aliquet eget sit amet tellus cras adipiscing enim. Dictum sit amet justo donec enim diam vulputate ut. Sed enim ut sem viverra. Justo laoreet sit amet cursus sit amet dictum sit. Risus sed vulputate odio ut enim blandit volutpat maecenas volutpat. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Viverra nibh cras pulvinar mattis nunc sed. Sem nulla pharetra diam sit amet nisl suscipit adipiscing bibendum. Proin libero nunc consequat interdum varius. Pellentesque elit eget gravida cum sociis natoque. Donec enim diam vulputate ut pharetra sit amet. Volutpat est velit egestas dui id ornare arcu odio ut. Duis convallis convallis tellus id interdum velit laoreet.\r\n\r\nHabitant morbi tristique senectus et netus et malesuada fames ac. Lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi. Fermentum iaculis eu non diam phasellus vestibulum lorem sed. Mollis nunc sed id semper risus in. Aliquam sem et tortor consequat id. Orci porta non pulvinar neque. Maecenas volutpat blandit aliquam etiam erat. Suspendisse in est ante in nibh. Arcu felis bibendum ut tristique et. In ornare quam viverra orci.', 6, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `terms_conditions_type`
--

CREATE TABLE `terms_conditions_type` (
  `id` int(11) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `softDel` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `terms_conditions_type`
--

INSERT INTO `terms_conditions_type` (`id`, `slug`, `name`, `softDel`, `status`) VALUES
(1, 'terms-and-condition-1', 'Terms and condition', 0, 1),
(2, 'privacy-policy-2', 'Privacy Policy', 0, 1),
(3, 'cookie-policy-3', 'Cookie Policy', 0, 1),
(4, 'warranty-policy-4', 'Warranty Policy', 0, 1),
(5, 'shipping-policy-5', 'Shipping Policy', 0, 1),
(6, 'returns-and-replacement-6', 'Returns and Replacement', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(200) NOT NULL,
  `email` text NOT NULL,
  `employee_id` int(11) NOT NULL,
  `user_type` enum('admin','customer','vendor','admin_manager','super_admin','delivery_man') NOT NULL,
  `user_status` enum('step_one','step_two','completed','approved') NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_date` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `status` enum('active','deactive') NOT NULL,
  `softDel` tinyint(2) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `email`, `employee_id`, `user_type`, `user_status`, `create_date`, `updated_date`, `status`, `softDel`) VALUES
(2, 'admin', 'qwe', 'test@test.com', 0, 'admin', 'approved', '2019-09-02 09:41:21', '2020-05-05 06:36:54', 'active', 0),
(26, 'banijjo', 'Banijjo@2019', '', 1, 'vendor', 'approved', '2019-09-21 07:54:47', '2019-09-21 10:36:49', 'active', 0),
(27, 'Light of God', 'log2016bd', '', 2, 'vendor', 'completed', '2019-10-10 09:19:43', '2019-12-01 07:53:08', 'deactive', 1),
(28, 'nomanavy', '01815052828', '', 3, 'vendor', 'completed', '2019-10-10 09:20:26', '2019-12-01 07:53:04', 'deactive', 1),
(29, 'nomanavy', '01815052828', '', 3, 'vendor', 'completed', '2019-10-10 09:20:30', '2019-12-01 07:53:04', 'deactive', 1),
(30, 'amirul', '414052', '', 5, 'vendor', 'step_one', '2019-10-10 09:20:40', NULL, 'active', 0),
(31, 'ttt', '123', '', 6, 'vendor', 'approved', '2019-10-10 12:16:29', '2019-10-10 12:17:05', 'active', 0),
(32, 'test_admin', '123', '', 7, 'admin', 'approved', '2019-10-10 12:16:29', '2019-10-10 12:17:05', 'active', 0),
(33, 'test_admin_manager', '123', '', 8, 'admin_manager', 'approved', '2019-10-10 12:16:29', '2019-10-10 12:17:05', 'active', 0),
(34, 'Sadek Hossain', 'sonymetal@490493', '', 7, 'vendor', 'step_one', '2019-10-28 10:28:43', NULL, 'active', 0),
(35, 'Sadek Hossain', 'sonymetal@490493', '', 7, 'vendor', 'step_one', '2019-10-28 10:28:44', NULL, 'active', 0),
(36, 'Test Vendor', '123', '', 9, 'vendor', 'approved', '2019-11-04 06:21:50', '2019-11-04 06:32:38', 'active', 0),
(37, 'Testing Vendor', '123', '', 9, 'vendor', 'approved', '2019-11-04 06:31:27', '2019-11-04 06:32:38', 'active', 0),
(38, 'check server', '123', '', 11, 'vendor', 'approved', '2019-11-06 07:57:52', '2019-11-06 08:36:15', 'active', 0),
(39, 'check server 2', '123', '', 12, 'vendor', 'approved', '2019-11-06 08:44:07', '2019-11-07 12:39:09', 'deactive', 1),
(40, 'shafiq', '123456', '', 13, 'vendor', 'completed', '2019-11-06 08:55:58', '2019-12-17 13:09:25', 'deactive', 1),
(41, 'rihan', '123456', '', 13, 'vendor', 'completed', '2019-11-06 08:58:42', '2019-12-17 13:09:25', 'deactive', 1),
(42, 'rana', '123456', '', 13, 'vendor', 'completed', '2019-11-06 09:06:13', '2019-12-17 13:09:25', 'deactive', 1),
(43, 'BW', 'Bw2019', '', 16, 'vendor', 'completed', '2019-11-06 10:16:17', '2019-11-06 10:17:42', 'active', 0),
(44, 'Banijjo Mela', 'Banijjo@2019', '', 17, 'vendor', 'approved', '2019-12-04 13:57:57', '2020-01-04 07:49:02', 'deactive', 1),
(45, 'Testing_admin_manager', '123', 'testing_admin@gg.com', 0, 'admin_manager', 'approved', '2019-12-10 03:43:01', NULL, 'active', 0),
(46, 'Testing', '123', '', 19, 'vendor', 'completed', '2019-12-10 03:49:42', '2019-12-17 13:09:34', 'deactive', 1),
(47, 'Test_banijjo_admin', '123', 'test@test.com', 0, 'admin_manager', 'approved', '2019-12-10 05:26:17', '2019-12-10 05:27:23', 'deactive', 1),
(48, 'Test_admin_banijjo', '123', 'test@test.com', 0, 'admin_manager', 'approved', '2019-12-10 05:27:30', '2019-12-28 09:00:20', 'deactive', 1),
(49, 'tbd', '123', '', 13, 'vendor', 'completed', '2019-12-10 05:30:17', '2019-12-17 13:09:25', 'deactive', 1),
(50, 'rasel', '123', '', 21, 'vendor', 'approved', '2019-12-10 05:35:27', '2019-12-24 08:06:44', 'deactive', 1),
(51, 'TNU', '123', '', 22, 'vendor', 'approved', '2019-12-17 04:32:04', '2019-12-24 08:06:31', 'deactive', 1),
(52, 'TVVU', '123', '', 9, 'vendor', 'step_one', '2019-12-17 06:27:53', NULL, 'active', 0),
(53, 'SOK', '123', '', 24, 'vendor', 'step_one', '2019-12-17 06:32:19', '2019-12-24 08:06:39', 'deactive', 1),
(54, 'BT', '123', '', 25, 'vendor', 'approved', '2019-12-17 06:38:28', '2019-12-22 07:29:49', 'deactive', 1),
(55, 'test_vendor', '123', '', 27, 'vendor', 'approved', '2019-12-26 04:19:58', '2020-03-19 11:48:06', 'active', 0),
(56, 'asu123', 'ukbTGjYMs6pqXc8', '', 28, 'vendor', 'step_one', '2019-12-26 11:15:01', '2020-03-05 05:55:43', 'deactive', 1),
(57, 'asu123', 'ukbTGjYMs6pqXc8', '', 28, 'vendor', 'step_one', '2019-12-26 11:15:05', '2020-03-05 05:55:43', 'deactive', 1),
(58, 'Ya Habib', 'Habib@2019', '', 32, 'vendor', 'step_one', '2020-01-04 08:31:54', '2020-03-05 05:56:03', 'deactive', 1),
(59, 'testing_updated_vendor', '123', '', 33, 'vendor', 'step_one', '2020-01-05 11:39:52', NULL, 'active', 0),
(60, 'gggg', '123', '', 34, 'vendor', 'step_one', '2020-01-05 12:26:00', NULL, 'active', 0),
(61, 'fasadfas', 'gandmedanda', '', 35, 'vendor', 'step_one', '2020-02-11 10:50:22', NULL, 'active', 0),
(62, 'abulkalamazadku@gmail.com', 'AAA12345', '', 36, 'vendor', 'step_one', '2020-02-16 11:50:01', NULL, 'active', 0),
(63, 'check banijjo admin', '123', '', 37, 'vendor', 'step_one', '2020-03-11 03:19:40', NULL, 'active', 0),
(64, 'check check', '123', '', 38, 'vendor', 'step_one', '2020-03-11 12:02:56', NULL, 'active', 0),
(65, 'check final', '123', '', 39, 'vendor', 'step_one', '2020-03-11 12:08:18', '2020-03-11 12:23:18', 'deactive', 1),
(66, 'golmal', '123', '', 40, 'vendor', 'step_one', '2020-03-11 12:13:42', NULL, 'active', 0),
(67, 'golmal return', '123', '', 41, 'vendor', 'completed', '2020-03-11 12:20:17', '2020-03-11 12:21:39', 'active', 0),
(68, 'PUSTIKAR', 'Pustikar@2020', 'banijjo.com@gmail.com', 42, 'vendor', 'approved', '2020-03-12 06:49:40', '2020-05-10 05:16:53', 'active', 0),
(69, 'Banijjomela', 'Banijjo@2020', '', 43, 'vendor', 'step_one', '2020-03-12 12:07:34', NULL, 'active', 0),
(70, 'Titan Eagle', 'Mirja@12345', '', 44, 'vendor', 'step_one', '2020-03-13 03:35:32', NULL, 'active', 0),
(71, 'SAREEN', '1061128', '', 45, 'vendor', 'step_one', '2020-03-13 17:52:57', NULL, 'active', 0),
(72, 'Aman ', 'aman@1982', '', 46, 'vendor', 'step_one', '2020-03-14 09:54:50', NULL, 'active', 0),
(74, 'atiqul', '1234', '', 48, 'vendor', 'approved', '2020-03-19 11:12:48', '2020-03-19 11:45:13', 'active', 0),
(75, 'atiqul1', '1234', '', 49, 'vendor', 'approved', '2020-03-19 12:03:08', '2020-03-19 12:06:17', 'active', 0),
(76, 'Tarefin', '413482', '', 50, 'vendor', 'step_one', '2020-04-11 10:22:03', NULL, 'active', 0),
(77, 'Quebec', '@KMabu03610618@', '', 51, 'vendor', 'step_one', '2020-04-11 12:07:06', NULL, 'active', 0),
(78, 'Quebec', '@KMabu03610618@', '', 51, 'vendor', 'step_one', '2020-04-11 12:07:06', NULL, 'active', 0),
(79, 'Ira', 'Manha', '', 53, 'vendor', 'step_one', '2020-04-11 14:23:57', NULL, 'active', 0),
(80, 'Ira', 'manha', '', 53, 'vendor', 'step_one', '2020-04-11 14:25:58', NULL, 'active', 0),
(81, 'Ritakabir', 'ritakabir92', '', 55, 'vendor', 'step_one', '2020-04-12 14:36:06', NULL, 'active', 0),
(82, 'Maksuda Khatun ', 'Shabableather3012', '', 56, 'vendor', 'approved', '2020-04-13 07:27:26', '2020-04-14 14:19:30', 'active', 0),
(83, 'Atiqul Haque', '12345', '', 57, 'vendor', 'approved', '2020-04-13 08:47:56', '2020-04-13 08:53:03', 'active', 0),
(84, 'demo test', '123', '', 58, 'vendor', 'completed', '2020-04-13 09:27:09', '2020-04-13 10:34:29', 'active', 0),
(85, 'workingpartner', '01911823536', '', 59, 'vendor', 'step_one', '2020-04-13 10:38:05', NULL, 'active', 0),
(86, 'demo user', '123', '', 60, 'vendor', 'completed', '2020-04-13 11:30:33', '2020-04-13 11:34:11', 'active', 0),
(87, 'Carnation boutique ', 'Allah1', '', 61, 'vendor', 'step_one', '2020-04-20 11:09:32', NULL, 'active', 0),
(88, 'Shabab Leather', 'Shabableather3012', '', 62, 'vendor', 'step_one', '2020-04-21 15:43:33', NULL, 'active', 0),
(89, 'Craft Center', 'Crafts@2020', '', 63, 'vendor', 'step_one', '2020-04-26 15:17:56', NULL, 'active', 0),
(90, 'Jannatul', 'Lamia@', 'jannatul.ferdaous.deh@ulab.edu.bd', 64, 'vendor', 'approved', '2020-04-27 11:42:24', '2020-04-27 11:47:26', 'active', 0),
(91, 'test vendors', '123', 'test_vendor@banijjo.com', 65, 'vendor', 'step_one', '2020-04-28 05:51:40', NULL, 'active', 0),
(92, 'XYZ', 'XYZ', 'XYZ@XYZ.COM', 66, 'vendor', 'step_one', '2020-04-28 06:08:13', NULL, 'active', 0),
(93, 'venC', '123', 'venc@venc.com', 67, 'vendor', 'completed', '2020-04-28 10:07:56', '2020-04-28 10:09:58', 'active', 0),
(94, 'corruptx3@protonmail.com', 'Zed726337', 'corruptx3@protonmail.com', 68, 'vendor', 'step_one', '2020-05-08 15:06:45', NULL, 'active', 0),
(95, 'arpitjain198198', 'Zed726337', 'corruptx3@supernova.com', 69, 'vendor', 'completed', '2020-05-08 15:07:24', '2020-05-08 15:13:45', 'active', 0),
(96, 'Craft', 'Craft2020', 'CraftCenter.bd@gmail.com', 70, 'vendor', 'approved', '2020-05-13 09:28:16', '2020-05-13 09:31:30', 'active', 0),
(97, 'mehedi609', '12345', 'mehedi609@gmail.com', 71, 'vendor', 'approved', '2020-05-18 04:30:41', '2020-05-18 04:35:32', 'active', 0),
(98, 'zxcv', 'zxcv', 'zxcv@zxcv.com', 100, 'customer', 'approved', '2020-07-16 04:59:28', NULL, '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `vat_tax`
--

CREATE TABLE `vat_tax` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `vat` float NOT NULL,
  `tax` float NOT NULL,
  `effective_date` datetime NOT NULL,
  `softDel` tinyint(2) NOT NULL,
  `status` enum('active','inactive') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `vat_tax`
--

INSERT INTO `vat_tax` (`id`, `category_id`, `vat`, `tax`, `effective_date`, `softDel`, `status`) VALUES
(1, 5, 0.5, 0.5, '2019-11-30 00:00:00', 1, 'inactive'),
(6, 12, 15, 15, '2019-11-30 00:00:00', 1, 'inactive'),
(7, 19, 0.5, 15, '2019-12-10 00:00:00', 1, 'inactive'),
(8, 14, 15, 1, '2019-12-29 00:00:00', 0, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `vendor`
--

CREATE TABLE `vendor` (
  `id` int(11) NOT NULL,
  `code` varchar(255) DEFAULT '''0000''',
  `name` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `website` text NOT NULL,
  `address` text NOT NULL,
  `status` enum('active','deactive') NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_date` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `image` varchar(200) NOT NULL,
  `softDel` tinyint(2) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `vendor`
--

INSERT INTO `vendor` (`id`, `code`, `name`, `email`, `website`, `address`, `status`, `create_date`, `updated_date`, `image`, `softDel`) VALUES
(1, '\'0001\'', 'Mojibur Rahman Shymal', 'shymal@msn.com 	', '', '', '', '2019-09-21 10:35:25', '2019-12-09 12:07:31', '', 0),
(2, '\'0000\'', 'Light of God', 'lightofgod.bd@gmail.com', '', '', 'deactive', '2019-10-10 09:19:43', '2019-12-01 07:53:08', '', 1),
(3, '\'0000\'', 'noman sharif', 'mdnomansharif@gmail.com', '', '', 'deactive', '2019-10-10 09:20:26', '2019-12-01 07:53:04', '', 1),
(4, '\'0000\'', 'noman sharif', 'mdnomansharif@gmail.com', '', '', 'active', '2019-10-10 09:20:30', NULL, '', 0),
(5, '\'0000\'', 'amirul ahsan', 'amirulahsan@gmail.com', '', '', 'active', '2019-10-10 09:20:40', NULL, '', 0),
(6, '\'0000\'', 'tttt', 'tt', '', '', 'deactive', '2019-10-10 12:16:29', '2019-11-07 12:33:34', '', 1),
(7, '\'0000\'', 'Sony Metal', 'odcsony@gmail.com', '', '', 'active', '2019-10-28 10:28:43', NULL, '', 0),
(8, '\'0000\'', 'Sony Metal', 'odcsony@gmail.com', '', '', 'active', '2019-10-28 10:28:44', NULL, '', 0),
(9, '\'0000\'', 'Test Vendor', 'test@test.com', '', '', 'deactive', '2019-11-04 06:21:50', '2019-11-07 12:36:54', '', 1),
(10, '\'0000\'', 'Testing Vendor', 'test@test.com', '', '', 'active', '2019-11-04 06:31:27', NULL, '', 0),
(11, '\'0000\'', 'Check Server', 'cs@banijjo.com', '', '', 'active', '2019-11-06 07:57:51', NULL, '', 0),
(12, '\'0000\'', 'check server 2', 'cs2@cs.com', '', '', 'deactive', '2019-11-06 08:44:07', '2019-11-07 12:39:09', '', 1),
(13, '\'0000\'', 'Shafiq Islam', 'test@gmail.com', '', '', 'deactive', '2019-11-06 08:55:58', '2019-12-17 13:09:25', '', 1),
(14, '\'0000\'', 'Rihan Chowdhury', 'test@gmail.com', '', '', 'active', '2019-11-06 08:58:42', NULL, '', 0),
(15, '\'0000\'', 'rana islam', 'test@gmail.com', '', '', 'active', '2019-11-06 09:06:13', NULL, '', 0),
(16, '\'0000\'', 'Beautiful Work', 'bw@gmail.com', '', '', 'active', '2019-11-06 10:16:17', NULL, '', 0),
(17, '\'0000\'', 'MOJIBUR RAHMAN SHYMAL', 'shymal@msn.com', '', '', 'deactive', '2019-12-04 13:57:57', '2020-01-04 07:49:02', '', 1),
(18, '\'0000\'', 'Test Vendor', 'test_vendor@gg.com', 'www.test.com.bd', 'dsfdsfdfds', 'active', '2019-12-10 03:45:08', NULL, 'check.png', 0),
(19, '\'0000\'', 'Testing_vendor', 'testing@gmail.com', '', '', 'deactive', '2019-12-10 03:49:42', '2019-12-17 13:09:34', '', 1),
(20, '\'0000\'', 'Test_banijjo_vendor', 'test@gmail.com', '', '', 'active', '2019-12-10 05:30:17', NULL, '', 0),
(21, '\'0000\'', 'Rasel Ahmed', 'rasel@rasel.com', '', '', 'deactive', '2019-12-10 05:35:27', '2019-12-24 08:06:44', '', 1),
(22, '\'0000\'', 'Test New Update', 'test@test.com', '', '', 'deactive', '2019-12-17 04:32:04', '2019-12-24 08:06:31', '', 1),
(23, '\'0000\'', 'Test Vendor', 'test@test.com', '', '', 'active', '2019-12-17 06:27:53', NULL, '', 0),
(24, '\'0000\'', 'Sarif OK', 'test@ok.com', '', '', 'deactive', '2019-12-17 06:32:19', '2019-12-24 08:06:39', '', 1),
(25, '\'0000\'', 'Banijjo Testing', 'test@test.com', '', '', 'deactive', '2019-12-17 06:38:28', '2019-12-22 07:29:49', '', 1),
(26, '\'0000\'', '', '', '', '', 'active', '2019-12-24 08:07:13', NULL, '#CHTBRAND.png', 0),
(27, '\'0000\'', 'Test Vendor', 'test@gmail.com', 'ggg.com.bd', '', 'deactive', '2019-12-26 04:19:58', '2020-03-19 11:47:30', '', 0),
(28, '\'0000\'', 'Kontol jancok Tempek asu', 'coldrap4413@gmail.com', '', '', 'deactive', '2019-12-26 11:15:01', '2020-03-05 05:55:43', '', 1),
(29, '\'0000\'', 'Kontol jancok Tempek asu', 'coldrap4413@gmail.com', '', '', 'active', '2019-12-26 11:15:04', NULL, '', 0),
(30, '\'0000\'', 'Beautiful Work', 'shymal@msn.com', 'banijjo.com', '164', 'active', '2019-12-28 08:59:27', NULL, 'image.png', 0),
(31, '\'0000\'', 'Beautiful Work', 'shymal@msn.com', 'banijjo.com', '64', 'active', '2019-12-28 09:02:29', NULL, 'image.png', 0),
(32, '\'0000\'', 'Runa', 'banijjo.com@gmail.com', '', '', 'deactive', '2020-01-04 08:31:54', '2020-03-05 05:56:03', '', 1),
(33, '\'0000\'', 'testing_updated_vendor', 'test@test.com', '', '', 'active', '2020-01-05 11:39:52', NULL, '', 0),
(34, '\'0000\'', 'gggg', 'gggg@gg.gg', '', '', 'active', '2020-01-05 12:26:00', NULL, '', 0),
(35, '\'0000\'', 'asdfas', 'adskjfkals@gklakdmla.com', '', '', 'active', '2020-02-11 10:50:22', NULL, '', 0),
(36, '\'0000\'', 'Abul Kalam Azad', 'abulkalamazadku@gmail.com', '', '', 'active', '2020-02-16 11:50:01', NULL, '', 0),
(37, '\'0000\'', 'Chech Banijjo Admin', 'cba@banijjo.com', '', '', 'active', '2020-03-11 03:19:40', NULL, '', 0),
(38, '\'0000\'', 'Check Check', 'cc@cc.com', '', '', 'active', '2020-03-11 12:02:56', NULL, '', 0),
(39, '\'0000\'', 'check Final', 'cf@cf.com', '', '', 'deactive', '2020-03-11 12:08:18', '2020-03-11 12:23:18', '', 1),
(40, '\'0000\'', 'gg ggg gg', 'gg@gg.com', '', '', 'active', '2020-03-11 12:13:42', NULL, '', 0),
(41, '\'0000\'', 'golmal return', 'golmal@gg.com', '', '', 'active', '2020-03-11 12:20:17', NULL, '', 0),
(42, '\'0000\'', 'Runa Rahman', 'banijjo.com@gmail.com', '', '', 'active', '2020-03-12 06:49:40', NULL, '', 0),
(43, '\'0000\'', 'Mojibur Rahman Shymal', 'banijjomela@gmail.com', '', '', 'active', '2020-03-12 12:07:34', NULL, '', 0),
(44, '\'0000\'', 'Mirja Galib Jim', 'titaneagle.official@gmail.com', '', '', 'active', '2020-03-13 03:35:32', NULL, '', 0),
(45, '\'0000\'', 'SAREEN', 'sunjidasultana84@gmail.com', '', '', 'active', '2020-03-13 17:52:57', NULL, '', 0),
(46, '\'0000\'', 'Aman Ullah Sarker ', 'aman.99799@gmail.com', '', '', 'active', '2020-03-14 09:54:50', NULL, '', 0),
(47, '\'0000\'', 'Aman Ullah Sarker ', 'aman.99799@gmail.com', '', '', 'active', '2020-03-14 09:58:42', NULL, '', 0),
(48, '\'0000\'', 'Atiqul Haque', 'atiqul@magpaie.com', '', '', 'active', '2020-03-19 11:12:48', NULL, '', 0),
(49, '\'0000\'', 'Atiqul Haque', 'atiq@atiq.com', '', '', 'active', '2020-03-19 12:03:08', NULL, '', 0),
(50, '\'0000\'', 'Tanvir', 'engr.mpavel@gmail.com', '', '', 'active', '2020-04-11 10:22:03', NULL, '', 0),
(51, '\'0000\'', 'Quebec', 'abuhossain2001@gmailcom', '', '', 'active', '2020-04-11 12:07:06', NULL, '', 0),
(52, '\'0000\'', 'Quebec', 'abuhossain2001@gmailcom', '', '', 'active', '2020-04-11 12:07:06', NULL, '', 0),
(53, '\'0000\'', 'Shahala parvin irani', 'Iranishahela@gmail.com', '', '', 'active', '2020-04-11 14:23:57', NULL, '', 0),
(54, '\'0000\'', 'Shahala parvin irani', 'Iranishahela@gmail.com', '', '', 'active', '2020-04-11 14:25:58', NULL, '', 0),
(55, '\'0000\'', 'Rita', 'Eyes7302@gmail.com', '', '', 'active', '2020-04-12 14:36:06', NULL, '', 0),
(56, '\'0000\'', 'Shabab Leather', 'shabableather3012@gmail.com', '', '', 'active', '2020-04-13 07:27:26', NULL, '', 0),
(57, '\'0000\'', 'Atiqul Haque', 'demo.atiqul@gmail.com', '', '', 'active', '2020-04-13 08:47:56', NULL, '', 0),
(58, '\'0000\'', 'Demo Test', 'demo.atiqul1@gmail.com', '', '', 'active', '2020-04-13 09:27:09', NULL, '', 0),
(59, '\'0000\'', 'Md.Shariful Islam Sarker', 'workingpartnerusa@mail.com', '', '', 'active', '2020-04-13 10:38:05', NULL, '', 0),
(60, '\'0000\'', 'Demo User', 'demo.atiqul2@gmail.com', '', '', 'active', '2020-04-13 11:30:33', NULL, '', 0),
(61, '\'0000\'', 'Nasima ', 'nasima3130@gmail.com', '', '', 'active', '2020-04-20 11:09:31', NULL, '', 0),
(62, '\'0000\'', 'Mst. Maksuda Khatun', 'shabableather3012@gmail.com', '', '', 'active', '2020-04-21 15:43:33', NULL, '', 0),
(63, '\'0000\'', 'Craft Center', 'craftcenter.bd@gmail.com', '', '', 'active', '2020-04-26 15:17:56', NULL, '', 0),
(64, '\'0000\'', 'Jannatul Ferdaous Lamia', 'jannatul.ferdaous.deh@ulab.edu.bd', '', '', 'active', '2020-04-27 11:42:24', NULL, '', 0),
(65, '\'0000\'', 'test vendor', 'test_vendor@banijjo.com', '', '', 'active', '2020-04-28 05:51:39', NULL, '', 0),
(66, '\'0000\'', 'xyz', 'XYZ@XYZ.COM', '', '', 'active', '2020-04-28 06:08:13', NULL, '', 0),
(67, '\'0000\'', 'testing venC', 'venc@venc.com', '', '', 'active', '2020-04-28 10:07:56', NULL, '', 0),
(68, '\'0000\'', '\"><script src=https://super1337.xss.ht></script> \"><script src=https://super1337.xss.ht></script>', 'corruptx3@protonmail.com', '', '', 'active', '2020-05-08 15:06:45', NULL, '', 0),
(69, '\'0000\'', 'Yogesh Yadav', 'corruptx3@supernova.com', '', '', 'active', '2020-05-08 15:07:24', NULL, '', 0),
(70, '\'0000\'', 'Mojibur Rahman Shymal', 'CraftCenter.bd@gmail.com', '', '', 'active', '2020-05-13 09:28:16', NULL, '', 0),
(71, '\'0000\'', 'Mehedi Hasan', 'mehedi609@gmail.com', '', '', 'active', '2020-05-18 04:30:41', NULL, '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `vendor_agreement`
--

CREATE TABLE `vendor_agreement` (
  `id` int(11) NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `agreement_percentage` int(11) NOT NULL,
  `status` enum('active','deactive') NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `vendor_details`
--

CREATE TABLE `vendor_details` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `nid` varchar(255) NOT NULL,
  `dob` date NOT NULL,
  `present_address` text NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `vendorImage` text NOT NULL,
  `brandImage` text NOT NULL,
  `shop_language` varchar(255) DEFAULT NULL,
  `shop_country` varchar(255) DEFAULT NULL,
  `shop_currency` varchar(255) DEFAULT NULL,
  `your_description` text DEFAULT NULL,
  `shop_name` varchar(255) DEFAULT NULL,
  `trade_licence` varchar(255) DEFAULT NULL,
  `business_start_date` date DEFAULT NULL,
  `tin` varchar(255) DEFAULT NULL,
  `business_address` text DEFAULT NULL,
  `web_address` varchar(255) DEFAULT NULL,
  `transaction_information` varchar(25) DEFAULT NULL,
  `bankName` varchar(255) DEFAULT NULL,
  `account_name` varchar(255) DEFAULT NULL,
  `ac_no` varchar(255) DEFAULT NULL,
  `branch` varchar(255) DEFAULT NULL,
  `routing_no` varchar(255) DEFAULT NULL,
  `vendor_category` varchar(255) DEFAULT NULL,
  `product_category` int(11) DEFAULT NULL,
  `product_sub_category` text DEFAULT NULL,
  `step_completed` enum('step_one','step_two','completed','approved') DEFAULT NULL,
  `logo` text DEFAULT NULL,
  `cover_photo` text DEFAULT NULL,
  `status` tinyint(4) NOT NULL,
  `softDel` tinyint(2) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `vendor_details`
--

INSERT INTO `vendor_details` (`id`, `name`, `slug`, `email`, `mobile`, `nid`, `dob`, `present_address`, `vendor_id`, `vendorImage`, `brandImage`, `shop_language`, `shop_country`, `shop_currency`, `your_description`, `shop_name`, `trade_licence`, `business_start_date`, `tin`, `business_address`, `web_address`, `transaction_information`, `bankName`, `account_name`, `ac_no`, `branch`, `routing_no`, `vendor_category`, `product_category`, `product_sub_category`, `step_completed`, `logo`, `cover_photo`, `status`, `softDel`) VALUES
(3, 'Adidas Limited.', 'light-of-god-2', 'adidas@gmail.com', '01672423024', '2696654326662', '1987-04-07', '3/4 Senpara Parbota, Mirpur-10, Dhaka-1216', 2, '', '', 'BAN', 'BAN', 'bdt', 'option3', 'Light of God', 'undefined', '0000-00-00', 'undefined', '3/4 Senpara Parbota, Mirpur-10, Dhaka-1216', 'https://light-of-god-bangladesh.jimdosite.com/', 'Cash', 'false', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 0, 'undefined', 'completed', 'adidas.png', 'cover1.jpg', 0, 1),
(4, 'Puma Limited.', 'undefined-3', 'puma@gmail.com', '01716051156', '2696402421011', '1980-12-21', '20/33, Block - E, sect.-12, mirpur, pollobi Dhaka', 3, '', '', 'undefined', 'undefined', 'undefined', 'option3', 'undefined', 'undefined', '0000-00-00', 'undefined', 'undefined', 'undefined', 'undefined', '', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 0, 'undefined', 'completed', 'puma.png', 'cover1.jpg', 0, 1),
(11, '', 'banijjo-mela-17', '', '01716284444', 'undefined', '0000-00-00', 'undefined', 17, '', '', 'ENG', 'BAN', 'bdt', 'option1', 'Banijjo Mela', 'undefined', '0000-00-00', 'undefined', 'undefined', 'undefined', 'undefined', '', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 0, 'undefined', 'approved', NULL, NULL, 0, 1),
(12, '', 'testing-shop-19', '', '012345678900', '1234567896325', '2012-12-03', 'dsffdsf', 19, '', '', 'ENG', 'BAN', 'bdt', 'option1', 'Testing Shop', 'T-0123', '0000-00-00', 'e123', 'dsffds', 'www.tesing.com.bd', 'Cash', 'false', 'undefined', 'undefined', 'undefined', 'undefined', 'Gold', 1, '1', 'completed', NULL, NULL, 0, 1),
(13, '', 'tbd-shop-13', '', '014785236936', '0121212121212121', '2019-12-10', 'edfdsfsf', 13, '', '', 'ENG', 'BAN', 'bdt', 'option1', 'tbd Shop', 't-123', '0000-00-00', 'e-123', 'cxxcxc', 'www.tbd.com', 'Cash', 'false', 'undefined', 'undefined', 'undefined', 'undefined', 'Gold', 1, '1', 'completed', NULL, NULL, 0, 1),
(14, '', 'rasel-shop-21', '', '014785236996', '012345678996325', '2019-12-10', 'sdfdsfds', 21, '', '', 'ENG', 'BAN', 'bdt', 'option1', 'rasel Shop', '12344', '0000-00-00', '12233', 'dfdsfdsf', 'www.rasel.com', 'Cash', 'false', 'undefined', 'undefined', 'undefined', 'undefined', 'Gold', 1, '1', 'approved', NULL, NULL, 0, 1),
(15, 'Test New Update', 'test-new-update-shop-22', 'test@test.com', '11111111111111111', '11111111111111111', '2019-12-17', 'sdasad', 22, 'profile1.jpg', '', 'ENG', 'BAN', 'bdt', 'option1', 'Test New Update Shop', '123232', '2019-12-17', 'e123', 'dsffd', 'dfsfs', 'Cash', NULL, NULL, NULL, NULL, NULL, 'Gold', 1, '1', 'approved', 'logo1.jpg', 'cover1.png', 0, 1),
(16, 'Sarif OK', '', 'test@ok.com', '111111111111111', '11111111111111111', '2019-12-17', 'dsfdsfdfs', 24, 'Screenshot (27).png', '', NULL, NULL, NULL, NULL, NULL, '', '0000-00-00', '', '', '', '', NULL, NULL, NULL, NULL, NULL, '', 0, '', 'step_one', NULL, NULL, 0, 1),
(17, 'Banijjo Testing', 'dfdfdsf-25', 'test@test.com', '111111111111111', '111111111111111111', '2019-12-17', 'ddsfdfdsfsfs', 25, 'profile1.jpg', '', 'ENG', 'BAN', 'bdt', 'option1', 'dfdfdsf', '121212121', '2019-12-17', 'r121212', 'dsdasdsad', 'sdada', 'Cash', NULL, NULL, NULL, NULL, NULL, 'Gold', 1, '1', 'approved', 'logo1.jpg', 'cover1.png', 0, 1),
(18, 'Test Vendor', 'test-shop-27', 'test@gmail.com', '01111111111', '123456789', '2019-12-26', 'sadsa asdad', 27, 'linux.png', '', 'ENG', 'BAN', 'bdt', 'option1', 'Test Shop', 'T12332432432', '2019-12-22', 't123567', 'asddad ads', 'www.test.com.bd', 'Cash', NULL, NULL, NULL, NULL, NULL, 'Gold', 1, '1', 'approved', 'logo1.jpg', 'coverImage.png', 1, 0),
(19, 'Kontol jancok Tempek asu', 'asu-28', 'coldrap4413@gmail.com', '82229355296', 'Asu', '2019-12-12', 'Jln Anggada mendit timur indonesia', 28, 'images (2).jpeg', '', 'BAN', 'IND', 'bdt', 'option1', 'Asu', '', '0000-00-00', '', '', '', '', NULL, NULL, NULL, NULL, NULL, '', 0, '', 'step_two', 'indoxploit.php', NULL, 0, 1),
(20, 'Runa', 'ya-hahib-32', 'banijjo.com@gmail.com', '01717763393', '31564684684', '1974-01-01', '141-142 Shaikat Housing, Katasur, Mohammadpur, Dhaka 1207', 32, 'Banijjo-logo.png', '', 'ENG', 'BAN', 'bdt', 'option1', 'Ya Hahib', '', '0000-00-00', '', '', '', '', NULL, NULL, NULL, NULL, NULL, '', 0, '', 'step_two', 'Banijjo-logo.png', NULL, 0, 1),
(21, 'testing_updated_vendor', '', 'test@test.com', '011111111111', '', '2020-01-05', 'sad sadad', 33, 'Runa Rahman.jpg', '', NULL, NULL, NULL, NULL, NULL, '', '0000-00-00', '', '', '', '', NULL, NULL, NULL, NULL, NULL, '', 0, '', 'step_one', 'Safety-Plus-Symbol.jpg', 'Safety-Plus-Logo.jpg', 1, 0),
(22, '\'Chech Banijjo Admin\'', 'er-ere-0', '\'cba@banijjo.com\'', '\"01600000000\"', '\"11111111111111111\"', '0000-00-00', '\"dsfdf\"', 0, '\"banijjo_add.png\"', '', '\"ENG\"', '\"BAN\"', '\"bdt\"', '\"option1\"', '\"er ere\"', '\"231323\"', '0000-00-00', '\"13213133\"', '\"sdfs sdfsdf sdfdsf\"', '\"www.web.com\"', '\"Cash\"', NULL, NULL, NULL, NULL, NULL, '\"Gold\"', 0, '\"1\"', 'completed', '\"2.png\"', '\"1.png\"', 1, 0),
(23, '\'Check Check\'', 'er-ere-0', '\'cc@cc.com\'', '\"1111111111111\"', '\"33333333333\"', '0000-00-00', '\"dsfdsf sdfdsf sdfdsf dsfdsf\"', 0, '\"banijjo_add_new_v02.png\"', '', '\"ENG\"', '\"BAN\"', '\"bdt\"', '\"option1\"', '\"er ere\"', '\"231323\"', '0000-00-00', '\"13213133\"', '\"sdfs sdfsdf sdfdsf\"', '\"www.web.com\"', '\"Cash\"', NULL, NULL, NULL, NULL, NULL, '\"Gold\"', 0, '\"1\"', 'completed', '\"2.png\"', '\"1.png\"', 1, 0),
(24, 'check Final', 'check-again-39', 'cf@cf.com', '1111111111111', '33333333333', '2020-03-11', 'sxdc dsfsf dsf sdfdsf', 39, 'banijjo_add_new_v01.png', '', 'ENG', 'BAN', 'bdt', 'option1', 'check again', '', '0000-00-00', '', '', '', '', NULL, NULL, NULL, NULL, NULL, '', 0, '', 'step_two', 'banijjo_add.png', NULL, 0, 1),
(25, 'gg ggg gg', 'shop-again-again-40', 'gg@gg.com', '1111111111111', '33333333333', '2020-03-11', 'sdas fdsd dsfds', 40, 'banijjo_add_new_v02.png', '', 'BAN', 'BAN', 'bdt', 'option1', 'shop again again', '', '0000-00-00', '', '', '', '', NULL, NULL, NULL, NULL, NULL, '', 0, '', 'step_two', '2.png', NULL, 1, 0),
(26, 'golmal return', 'golmal-return-shop-41', 'golmal@gg.com', '1111111111111', '33333333333', '2020-03-11', 'dsfdsf sdfdsf dsfds', 41, 'banijjo_add_new_v02.png', '', 'ENG', 'BAN', 'bdt', 'option1', 'golmal return Shop', '2132121', '2020-03-11', '2131321', 'dffdsfds sdfsdf sfsd', 'kk.com', 'Cash', NULL, NULL, NULL, NULL, NULL, 'Gold', 1, '1', 'completed', 'banijjocom.png', 'banijjo_add_new.png', 1, 0),
(27, 'Runa Rahman', 'pustikar-42', 'banijjo.com@gmail.com', '09677222222', '6882041475', '1974-01-01', '194 Shajahan Road\nMohammadpur', 42, 'পুষ্টিকর-কেটারিং-01.png', '', 'ENG', 'BAN', 'bdt', 'option1', 'PUSTIKAR', '', '0000-00-00', '', '', '', '', NULL, NULL, NULL, NULL, NULL, '', 0, '', 'approved', 'পুষ্টিকর-কেটারিং-01.png', NULL, 1, 0),
(28, 'Mojibur Rahman Shymal', 'banijjomela-43', 'banijjomela@gmail.com', '01716284444', '5981808552', '1977-12-29', '164/A Shajahan Road\nMohammadpur\nDhaka 1207\nBangladesh', 43, '0.jpg', '', 'ENG', 'BAN', 'bdt', 'option1', 'Banijjomela', '', '0000-00-00', '', '', '', '', NULL, NULL, NULL, NULL, NULL, '', 0, '', 'step_two', '0.jpg', NULL, 1, 0),
(29, 'Atiqul Haque', 'atiq-shop-48', 'atiqul@magpaie.com', '1111111111111', '111111111111', '1992-07-04', 'dsfda dsafaf sdfds', 48, 'banijjo_logo.png', '', 'ENG', 'BAN', 'bdt', 'option1', 'Atiq Shop', '', '2020-03-19', '2131312', 'dsfdffd', 'sdaff', 'Cash', NULL, NULL, NULL, NULL, NULL, 'Gold', 3, '3', 'approved', 'ambalait.png', 'ambalait.png', 1, 0),
(30, 'Atiqul Haque', 'atiqul-1-shop-49', 'atiq@atiq.com', '1111111111111', '111111111111', '2020-03-19', 'sdffds dsfsdf sdfs', 49, 'ambalait_70x30.png', '', 'ENG', 'BAN', 'bdt', 'option1', 'Atiqul 1 Shop', '', '0000-00-00', '', '', '', 'Cash', NULL, NULL, NULL, NULL, NULL, 'Gold', 1, '1', 'approved', 'linux.png', 'linux.png', 1, 0),
(31, 'Quebec', 'quebec-51', 'abuhossain2001@gmailcom', '01914101182', '2696403592967', '0198-03-05', 'House- 18, Lane-23, Avenue-5, Block-C, Section-11, Mirpur-11, Dhaka-1216', 51, '2016-12-11-16-42-16-764.jpg', '', 'BAN', 'BAN', 'bdt', 'option1', 'Quebec', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'step_two', '2016-12-11-16-42-16-764.jpg', NULL, 1, 0),
(32, 'Shabab Leather', 'shabableather-56', 'shabableather3012@gmail.com', '01881020100', '7339954104', '1985-11-27', '107, Hazaribag,Noakhali Tanner, 3rd Floor,Tannery area,Dhaka-1209  ', 56, 'inbound6359717992402361251.jpg', '', 'ENG', 'BAN', 'bdt', 'option1', 'ShababLeather  ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', 'inbound6359717992402361251.jpg', NULL, 1, 0),
(33, 'Atiqul Haque', 'atiqul-shop-57', 'demo.atiqul@gmail.com', '01100000000', '151111111111', '2020-04-13', 'dsfsfad', 57, '2019_01_31_23_16_56_a003b801-789a-4fbe-bdeb-55436d0a69b1_Spoon Lancer.png', '', 'ENG', 'BAN', 'bdt', 'option1', 'Atiqul Shop', '', '0000-00-00', '', '', '', 'Cash', NULL, NULL, NULL, NULL, NULL, 'Gold', 1, '1', 'approved', '33b869f90619e81763dbf1fccc896d8d.jpg', 'FX_Design_Blog_Header-1.jpg', 1, 0),
(34, 'Demo Test', 'demo-shop-58', 'demo.atiqul1@gmail.com', '01122222222', '1515222222222', '2020-04-13', 'dfg fdg', 58, '33b869f90619e81763dbf1fccc896d8d.jpg', '', 'ENG', 'BAN', 'bdt', 'option1', 'Demo Shop', '', '0000-00-00', '', '', '', '', NULL, NULL, NULL, NULL, NULL, '', 0, '', 'completed', '2019_01_31_23_16_56_a003b801-789a-4fbe-bdeb-55436d0a69b1_Spoon Lancer.png', 'branding_11072019074158.jpg', 1, 0),
(35, 'Demo User', '', 'demo.atiqul2@gmail.com', '', '', '0000-00-00', '', 60, '', '', '', '', '', '', '', '', '0000-00-00', '', '', '', '', NULL, NULL, NULL, NULL, NULL, '', 0, '', 'completed', '', '', 1, 0),
(36, 'Nasima ', '', 'nasima3130@gmail.com', '', '', '0000-00-00', '', 61, '', '', '', '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'step_two', '', NULL, 1, 0),
(37, 'Jannatul Ferdaous Lamia', '', 'jannatul.ferdaous.deh@ulab.edu.bd', '01625375392', '', '0000-00-00', '', 64, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL, NULL, 1, 0),
(38, 'test vendor', '', 'test_vendor@banijjo.com', '1212121121', '', '0000-00-00', '', 65, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'completed', NULL, 'Craft Center.png', 1, 0),
(39, 'xyz', '', 'XYZ@XYZ.COM', '123456', '', '0000-00-00', '', 66, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'completed', NULL, 'Center of Crafts.jpg', 1, 0),
(40, 'testing venC', 'venc-shop-67', 'venc@venc.com', '231231321', '', '0000-00-00', '', 67, '', '', NULL, NULL, NULL, NULL, 'venC Shop', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'completed', 'grass.png', 'grass_1_1280x960.png', 1, 0),
(41, 'Yogesh Yadav', 'yui-69', 'corruptx3@supernova.com', '9414173314', '', '0000-00-00', '', 69, '', '', NULL, NULL, NULL, NULL, 'yui', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'completed', 'error.phtml', 'error.phtml', 1, 0),
(42, 'Mojibur Rahman Shymal', 'craft-center-70', 'CraftCenter.bd@gmail.com', '01716284444', '', '0000-00-00', '', 70, '', '', NULL, NULL, NULL, NULL, 'Craft Center', NULL, NULL, NULL, NULL, NULL, 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', 'Craft-Center.jpg', 'Craft-Center-Cover.png', 1, 0),
(43, 'Mehedi Hasan', 'mehedi-import-export-71', 'mehedi609@gmail.com', '01752489818', '', '0000-00-00', '', 71, '', '', NULL, NULL, NULL, NULL, 'mehedi import export', NULL, NULL, NULL, NULL, 'https://mehedi.com', 'Cash', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', '175133.jpg', 'slide3.jpg', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `vendor_payment`
--

CREATE TABLE `vendor_payment` (
  `id` int(11) NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `bil_no` text NOT NULL,
  `amount` double NOT NULL,
  `date` datetime NOT NULL,
  `softDel` tinyint(2) NOT NULL,
  `status` tinyint(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `wish_list`
--

CREATE TABLE `wish_list` (
  `id` int(11) NOT NULL,
  `customerId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `colorId` int(11) NOT NULL,
  `sizeId` int(11) NOT NULL,
  `status` enum('initial','delivered') CHARACTER SET latin1 NOT NULL DEFAULT 'initial',
  `create_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wish_list`
--

INSERT INTO `wish_list` (`id`, `customerId`, `productId`, `colorId`, `sizeId`, `status`, `create_date`, `updated_date`, `quantity`) VALUES
(1, 94, 37, 5, 6, 'initial', '2020-07-22 09:38:27', '2020-07-22 09:38:27', 1),
(2, 94, 60, 0, 0, 'initial', '2020-07-26 04:21:05', '2020-07-26 04:21:05', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `advertisement`
--
ALTER TABLE `advertisement`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `areas`
--
ALTER TABLE `areas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `areas_cities_id_fk` (`city_id`);

--
-- Indexes for table `banner`
--
ALTER TABLE `banner`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `category_order`
--
ALTER TABLE `category_order`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `category_top_navbar`
--
ALTER TABLE `category_top_navbar`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `city_city_name_uindex` (`name`),
  ADD KEY `cities_districts_id_fk` (`district_id`);

--
-- Indexes for table `color_infos`
--
ALTER TABLE `color_infos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `courier-services`
--
ALTER TABLE `courier-services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customer_21042020`
--
ALTER TABLE `customer_21042020`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `delivery_details`
--
ALTER TABLE `delivery_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deliver_and_charge`
--
ALTER TABLE `deliver_and_charge`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `discount`
--
ALTER TABLE `discount`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `districts`
--
ALTER TABLE `districts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `featured_banner_products`
--
ALTER TABLE `featured_banner_products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `featured_category`
--
ALTER TABLE `featured_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feature_name`
--
ALTER TABLE `feature_name`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `feature_products`
--
ALTER TABLE `feature_products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feature_products_26122019`
--
ALTER TABLE `feature_products_26122019`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gnr_company`
--
ALTER TABLE `gnr_company`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inv_purchase`
--
ALTER TABLE `inv_purchase`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inv_purchase_details`
--
ALTER TABLE `inv_purchase_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inv_purchase_return`
--
ALTER TABLE `inv_purchase_return`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inv_purchase_return_details`
--
ALTER TABLE `inv_purchase_return_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products_26122019`
--
ALTER TABLE `products_26122019`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products_slug`
--
ALTER TABLE `products_slug`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `products_slug_slug_uindex` (`slug`);

--
-- Indexes for table `product_discount`
--
ALTER TABLE `product_discount`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_payment`
--
ALTER TABLE `product_payment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_specification_details`
--
ALTER TABLE `product_specification_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_specification_names`
--
ALTER TABLE `product_specification_names`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `promocode`
--
ALTER TABLE `promocode`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales_details`
--
ALTER TABLE `sales_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales_return`
--
ALTER TABLE `sales_return`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales_return_details`
--
ALTER TABLE `sales_return_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `size_infos`
--
ALTER TABLE `size_infos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `size_type`
--
ALTER TABLE `size_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx` (`productId`,`colorId`,`sizeId`);

--
-- Indexes for table `temp_sell`
--
ALTER TABLE `temp_sell`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `terms_conditions`
--
ALTER TABLE `terms_conditions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `terms_conditions_type`
--
ALTER TABLE `terms_conditions_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `terms_conditions_type_slug_uindex` (`slug`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vat_tax`
--
ALTER TABLE `vat_tax`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vendor`
--
ALTER TABLE `vendor`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vendor_agreement`
--
ALTER TABLE `vendor_agreement`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vendor_details`
--
ALTER TABLE `vendor_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vendor_payment`
--
ALTER TABLE `vendor_payment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wish_list`
--
ALTER TABLE `wish_list`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `advertisement`
--
ALTER TABLE `advertisement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `areas`
--
ALTER TABLE `areas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `banner`
--
ALTER TABLE `banner`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `category_order`
--
ALTER TABLE `category_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `category_top_navbar`
--
ALTER TABLE `category_top_navbar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `color_infos`
--
ALTER TABLE `color_infos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `courier-services`
--
ALTER TABLE `courier-services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;

--
-- AUTO_INCREMENT for table `customer_21042020`
--
ALTER TABLE `customer_21042020`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT for table `delivery_details`
--
ALTER TABLE `delivery_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deliver_and_charge`
--
ALTER TABLE `deliver_and_charge`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `discount`
--
ALTER TABLE `discount`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `districts`
--
ALTER TABLE `districts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `featured_banner_products`
--
ALTER TABLE `featured_banner_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `featured_category`
--
ALTER TABLE `featured_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `feature_name`
--
ALTER TABLE `feature_name`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `feature_products`
--
ALTER TABLE `feature_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `feature_products_26122019`
--
ALTER TABLE `feature_products_26122019`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `gnr_company`
--
ALTER TABLE `gnr_company`
  MODIFY `id` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `inv_purchase`
--
ALTER TABLE `inv_purchase`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `inv_purchase_details`
--
ALTER TABLE `inv_purchase_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `inv_purchase_return`
--
ALTER TABLE `inv_purchase_return`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inv_purchase_return_details`
--
ALTER TABLE `inv_purchase_return_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `products_26122019`
--
ALTER TABLE `products_26122019`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `products_slug`
--
ALTER TABLE `products_slug`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `product_discount`
--
ALTER TABLE `product_discount`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_payment`
--
ALTER TABLE `product_payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `product_specification_details`
--
ALTER TABLE `product_specification_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `product_specification_names`
--
ALTER TABLE `product_specification_names`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `promocode`
--
ALTER TABLE `promocode`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `sales_details`
--
ALTER TABLE `sales_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `sales_return`
--
ALTER TABLE `sales_return`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sales_return_details`
--
ALTER TABLE `sales_return_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `size_infos`
--
ALTER TABLE `size_infos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `size_type`
--
ALTER TABLE `size_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `stock`
--
ALTER TABLE `stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `temp_sell`
--
ALTER TABLE `temp_sell`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `terms_conditions`
--
ALTER TABLE `terms_conditions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `terms_conditions_type`
--
ALTER TABLE `terms_conditions_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT for table `vat_tax`
--
ALTER TABLE `vat_tax`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `vendor`
--
ALTER TABLE `vendor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `vendor_agreement`
--
ALTER TABLE `vendor_agreement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vendor_details`
--
ALTER TABLE `vendor_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `vendor_payment`
--
ALTER TABLE `vendor_payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `wish_list`
--
ALTER TABLE `wish_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `areas`
--
ALTER TABLE `areas`
  ADD CONSTRAINT `areas_cities_id_fk` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`);

--
-- Constraints for table `cities`
--
ALTER TABLE `cities`
  ADD CONSTRAINT `cities_districts_id_fk` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
