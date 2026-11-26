--
-- Database: `shopkart`
--
-- --------------------------------------------------------
--
-- Table structure for table `sub_categories`
--
CREATE TABLE `sub_categories` (
  `id` int(11) NOT NULL,
  `category_id` INT NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `url` varchar(100) DEFAULT NULL,
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
-- Indexes for table `sub_categories`
--
ALTER TABLE `sub_categories`
	ADD PRIMARY KEY (`id`);

ALTER TABLE `sub_categories`
	ADD FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`);

--
-- AUTO_INCREMENT for dumped tables
--
--
-- AUTO_INCREMENT for table `sub_categories`
--
ALTER TABLE `sub_categories`
	MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

COMMIT;