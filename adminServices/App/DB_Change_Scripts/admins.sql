--
-- Database: `shopkart`
--
-- --------------------------------------------------------
--
-- Table structure for table `admins`
--
CREATE TABLE `admins` (
  `id` int(10) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `number` VARCHAR(25) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `address` text NOT NULL,
  `block` tinyint(1) DEFAULT 0,
  `block_reason` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,	
  `deleted_at` timestamp NULL DEFAULT NULL
);

--
-- Indexes for dumped tables
--
--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
	ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--
--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
	MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `admins`
  MODIFY `block_reason` text DEFAULT NULL;

COMMIT;