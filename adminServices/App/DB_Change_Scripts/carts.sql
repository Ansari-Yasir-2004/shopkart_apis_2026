--
-- Database: `shopkart`
--
-- --------------------------------------------------------
--
-- Table structure for table `carts`
--
CREATE TABLE `carts` (
  `id` int(11) NOT NULL,
  `user_id` INT NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
);

--
-- Indexes for dumped tables
--
--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
	ADD PRIMARY KEY (`id`);

ALTER TABLE `carts`
	ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;

--
-- AUTO_INCREMENT for dumped tables
--
--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
	MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

COMMIT;