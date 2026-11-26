--
-- Database: `shopkart`
--
-- --------------------------------------------------------
--
-- Table structure for table `orders`
--
CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` INT NOT NULL,
  `user_address_id` INT NOT NULL,
  `reason` TEXT NOT NULL,
  `status` ENUM('PENDING', 'ORDERED', "ACCEPT", "PROGRESS", 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
  `delivery_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
);

--
-- Indexes for dumped tables
--
--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
	ADD PRIMARY KEY (`id`);

ALTER TABLE `orders`
	ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;

ALTER TABLE `orders`
	ADD FOREIGN KEY (`user_address_id`) REFERENCES `user_addresses`(`id`) ON DELETE CASCADE;

--
-- AUTO_INCREMENT for dumped tables
--
--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
	MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

COMMIT;