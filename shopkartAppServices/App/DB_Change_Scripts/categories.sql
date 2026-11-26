--
-- Database: `shopkart`
--
-- --------------------------------------------------------
--
-- Table structure for table `categories`
--
CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
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
-- Indexes for table `categories`
--
ALTER TABLE `categories`
	ADD PRIMARY KEY (`id`);
  
--
-- AUTO_INCREMENT for dumped tables
--
--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
	MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

COMMIT;
