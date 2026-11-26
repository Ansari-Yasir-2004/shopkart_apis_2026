--
-- Database: `shopkart`
--
-- --------------------------------------------------------
--
-- Table structure for table `app_banners`
--
CREATE TABLE `app_banners` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `url` varchar(100) DEFAULT NULL,
  `position` int(11) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
);

--
-- Indexes for dumped tables
--
--
-- Indexes for table `app_banners`
--
ALTER TABLE `app_banners`
	ADD PRIMARY KEY (`id`);
  
--
-- AUTO_INCREMENT for dumped tables
--
--
-- AUTO_INCREMENT for table `app_banners`
--
ALTER TABLE `app_banners`
	MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

COMMIT;
