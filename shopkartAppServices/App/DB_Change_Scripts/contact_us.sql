--
-- Database: `shopkart`
--
-- --------------------------------------------------------
--
-- Table structure for table `contact_us`
--
CREATE TABLE `contact_us` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `number` VARCHAR(25) DEFAULT NULL,
  `message` text NOT NULL,
  `status` ENUM('UNSEEN', 'SEEN') DEFAULT('UNSEEN'),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
);	

--
-- Indexes for dumped tables
--
--
-- Indexes for table `contact_us`
--
ALTER TABLE `contact_us`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--
--
-- AUTO_INCREMENT for table `contact_us`
--
ALTER TABLE `contact_us`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

COMMIT;