--
-- Database: `shopkart`
--
-- --------------------------------------------------------
--
-- Table structure for table `order_invoices`
--
CREATE TABLE `order_invoices` (
  `id` int(11) NOT NULL,
  `order_id` INT NOT NULL,
  `sub_total` DECIMAL(10,2) NOT NULL,
  `discount_amount` DECIMAL(10,2) DEFAULT 0,
  `tax_amount` DECIMAL(10,2) DEFAULT 0,
  `delivery_charge` DECIMAL(10,2) DEFAULT 0,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `payment_method` ENUM('COD', 'ONLINE') DEFAULT 'COD',
  `payment_status` ENUM('PENDING', 'PAID', "FAILED") DEFAULT 'PENDING',
  `transaction_id` VARCHAR(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
);

--
-- Indexes for dumped tables
--
--
-- Indexes for table `order_invoices`
--
ALTER TABLE `order_invoices`
	ADD PRIMARY KEY (`id`);

  ALTER TABLE `order_invoices`
	ADD FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE;

--
-- AUTO_INCREMENT for dumped tables
--
--
-- AUTO_INCREMENT for table `order_invoices`
--
ALTER TABLE `order_invoices`
	MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

COMMIT;