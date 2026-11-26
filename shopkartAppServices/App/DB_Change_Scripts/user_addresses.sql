--
-- Database: `shopkart`
--
-- --------------------------------------------------------
--
-- Table structure for table `user_addresses`
--
CREATE TABLE `user_addresses` (
  `id` int(10) NOT NULL,
  `user_id` INT NOT NULL,
  `country` VARCHAR(100) DEFAULT 'India',
  `state` VARCHAR(100) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `building` VARCHAR(150) DEFAULT NULL,
  `area` VARCHAR(150) DEFAULT NULL,
  `landmark` VARCHAR(150) DEFAULT NULL,
  `address` text NOT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
);

--
-- Indexes for dumped tables
--
--
-- Indexes for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--
--
-- AUTO_INCREMENT for table `user_addresses`
--
ALTER TABLE `user_addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `user_addresses`
	ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;

COMMIT;