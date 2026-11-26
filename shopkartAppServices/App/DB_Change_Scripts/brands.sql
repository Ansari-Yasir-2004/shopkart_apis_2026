--
-- Database: `shopkart`
--
-- --------------------------------------------------------
--
-- Table structure for table `brands`
--
CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `url` varchar(100) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `status` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
);

--
-- Indexes for dumped tables
--
--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
	ADD PRIMARY KEY (`id`);
  
--
-- AUTO_INCREMENT for dumped tables
--
--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
	MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

COMMIT;
