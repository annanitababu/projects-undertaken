-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 15, 2025 at 07:00 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `votingsystem`
--

-- --------------------------------------------------------

--
-- Table structure for table `voterdetails`
--

CREATE TABLE `voterdetails` (
  `VoterID` int(11) NOT NULL,
  `VoterName` varchar(255) NOT NULL,
  `VoterAddr` varchar(300) NOT NULL,
  `username` varchar(300) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `voterdetails`
--

INSERT INTO `voterdetails` (`VoterID`, `VoterName`, `VoterAddr`, `username`, `password`) VALUES
(1, 'Jenny Parker', '0xf6623e9b7669DA2Da4348F440fAB43BE88691467', 'abc@gmail.com', '1234'),
(2, 'Sam Denny', '0xaF98b8702d91B46Fb75D74f11C97B377d2fE8603', 'def@gmail.com', '1234'),
(8, 'Anna Emily', '0x6e34b85d634166961783BA2fb08e90Be50634d84', 'ghi@gmail.com', '1234'),
(9, 'Ken Denny', '0x5a5526C4b9d5116CA7BF43cD1028258C0ba4d965', 'jkl@gmail.com', '1234'),
(10, 'Jackson Park', '0x2531E3fC1585204cd208a05185106c40F00E166e', 'mno@gmail.com', '1234'),
(11, 'Betty Parker', '0xaE32A4D99038934770FE798a76c1AaCfa44384cf', 'pqr@gmail.com', '1234');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `voterdetails`
--
ALTER TABLE `voterdetails`
  ADD PRIMARY KEY (`VoterID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `voterdetails`
--
ALTER TABLE `voterdetails`
  MODIFY `VoterID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
