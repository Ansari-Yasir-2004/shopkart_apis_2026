--
-- Database: `shopkart`
--
-- --------------------------------------------------------
--
-- Table structure for table `order_items`
--
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `name` varchar(200),
  `url` varchar(100) DEFAULT NULL,
  `discount_price` DECIMAL(10,2),
  `original_price` DECIMAL(10,2),
  `quantity` INT NOT NULL DEFAULT 1,
  `total_price` DECIMAL(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
);

--
-- Indexes for dumped tables
--
--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
	ADD PRIMARY KEY (`id`);

ALTER TABLE `order_items`
	ADD FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE;

ALTER TABLE `order_items`
	ADD FOREIGN KEY (`product_id`) REFERENCES `products`(`id`);

--
-- AUTO_INCREMENT for dumped tables
--
--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
	MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

COMMIT;