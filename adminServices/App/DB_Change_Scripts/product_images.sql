--
-- Database: `shopkart`
--

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` INT NOT NULL,
  `url` varchar(200),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `product_images`
--

ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `product_images`
  ADD FOREIGN KEY (`product_id`) REFERENCES `products`(`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `product_images`
--

ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

COMMIT;