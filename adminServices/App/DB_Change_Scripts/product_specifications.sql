--
-- Database: `shopkart`
--
-- --------------------------------------------------------
--
-- Table structure for table `product_specifications`
--
CREATE TABLE `product_specifications` (
  `id` int(11) NOT NULL,
  `product_id` INT NOT NULL,
  `name` varchar(191),
  `value` varchar(255),
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
-- Indexes for table `product_specifications`
--
ALTER TABLE `product_specifications`
	ADD PRIMARY KEY (`id`);

ALTER TABLE `product_specifications`
	ADD FOREIGN KEY (`product_id`) REFERENCES `products`(`id`);

--
-- AUTO_INCREMENT for dumped tables
--
--
-- AUTO_INCREMENT for table `product_specifications`
--
ALTER TABLE `product_specifications`
	MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

COMMIT;