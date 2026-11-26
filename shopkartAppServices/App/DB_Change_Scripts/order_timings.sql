--
-- Database: `shopkart`
--
-- --------------------------------------------------------
--
-- Table structure for table `order_timings`
--
CREATE TABLE `order_timings` (
  `id` int(11) NOT NULL,
  `order_id` INT NOT NULL,
  `status` ENUM('PENDING', 'ORDERED', "ACCEPT", "PROGRESS", 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
);

--
-- Indexes for dumped tables
--
--
-- Indexes for table `order_timings`
--
ALTER TABLE `order_timings`
	ADD PRIMARY KEY (`id`);

  ALTER TABLE `order_timings`
	ADD FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE;

--
-- AUTO_INCREMENT for dumped tables
--
--
-- AUTO_INCREMENT for table `order_timings`
--
ALTER TABLE `order_timings`
	MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

COMMIT;