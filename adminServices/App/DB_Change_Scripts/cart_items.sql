--
-- Database: `shopkart`
--
-- --------------------------------------------------------
--
-- Table structure for table `cart_items`
--
CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `cart_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
);

--
-- Indexes for dumped tables
--
--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
	ADD PRIMARY KEY (`id`);

ALTER TABLE `cart_items`
	ADD FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`) ON DELETE CASCADE;

ALTER TABLE `cart_items`
	ADD FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE;

--
-- AUTO_INCREMENT for dumped tables
--
--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
	MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

COMMIT;