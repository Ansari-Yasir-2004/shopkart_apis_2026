--
-- Database: `shopkart`
--
-- --------------------------------------------------------
--
-- Table structure for table `enquiries`
--
CREATE TABLE `enquiries` (
  `id` int(11) NOT NULL,
  `url` varchar(100) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(255) NOT NULL,
  `number` VARCHAR(25) DEFAULT NULL,
  `description` text NOT NULL,
  `status` ENUM('PENDING', 'RESOLVED') DEFAULT('PENDING'),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
);	

--
-- Indexes for dumped tables
--
--
-- Indexes for table `enquiries`
--
ALTER TABLE `enquiries`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--
--
-- AUTO_INCREMENT for table `enquiries`
--
ALTER TABLE `enquiries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

COMMIT;