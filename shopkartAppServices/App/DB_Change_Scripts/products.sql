--
-- Database: `shopkart`
--
-- --------------------------------------------------------
--
-- Table structure for table `products`
--
CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `brand_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  `sub_category_id` INT DEFAULT NULL,
  `name` varchar(200),
  `slug` varchar(200),
  `original_price` DECIMAL(10,2),
  `discount_price` DECIMAL(10,2),
  `description` TEXT,
  `position` int(11) DEFAULT NULL,
  `out_of_stock` tinyint(1) DEFAULT 0,
  `is_featured` tinyint(1) DEFAULT 1,
  `is_new_arrival` tinyint(1) DEFAULT 1,
  `status` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
);

--
-- Indexes for dumped tables
--
--
-- Indexes for table `products`
--
ALTER TABLE `products`
	ADD PRIMARY KEY (`id`);

ALTER TABLE `products` 
  ADD FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`);

ALTER TABLE `products`
	ADD FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`);

ALTER TABLE `products`
	ADD FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories`(`id`);

--
-- AUTO_INCREMENT for dumped tables
--
--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
	MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `products`
  MODIFY `out_of_stock` tinyint(1) DEFAULT 0;

ALTER TABLE `products`
  ADD `url` varchar(100) DEFAULT NULL AFTER `name`;

COMMIT;
