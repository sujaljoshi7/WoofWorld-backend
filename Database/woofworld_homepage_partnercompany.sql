-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: woofworld
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `homepage_partnercompany`
--

DROP TABLE IF EXISTS `homepage_partnercompany`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `homepage_partnercompany` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image` varchar(500) NOT NULL,
  `name` varchar(100) NOT NULL,
  `status` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `homepage_partnercompany`
--

LOCK TABLES `homepage_partnercompany` WRITE;
/*!40000 ALTER TABLE `homepage_partnercompany` DISABLE KEYS */;
INSERT INTO `homepage_partnercompany` VALUES (1,'https://i.ibb.co/pjWQfTnh/app-rena-brand-removebg-preview.png','Rena',1),(2,'https://i.ibb.co/5Wsh6Ffq/download-10-removebg-preview.png','Purepet',1),(3,'https://i.ibb.co/Lh5gyrpt/download-1-removebg-preview.png','Drools',1),(4,'https://i.ibb.co/84sVM9J5/download-9-removebg-preview.png','Tropiclean',1),(5,'https://i.ibb.co/7xsJm7fz/download-8-removebg-preview.png','Zeedog',1),(6,'https://i.ibb.co/ksxv5D0j/download-7-removebg-preview-1.png','Bark Butler',1),(7,'https://i.ibb.co/SXr28rZ2/download-7-removebg-preview.png','Royal Canin',1),(8,'https://i.ibb.co/WNKSs0B7/download-removebg-preview-1.png','Himalaya',1),(9,'https://i.ibb.co/dwywT0vf/download-17-removebg-preview.png','Jer High',1),(10,'https://i.ibb.co/R54Gnv5/download-19-removebg-preview.png','First Bark',1),(11,'https://i.ibb.co/xtxbjfNc/download-18-removebg-preview.png','Dogaholic',1),(12,'https://i.ibb.co/wZ5MFHfJ/download-removebg-preview-2.png','Snackers',1),(13,'https://i.ibb.co/QjqfLBTv/download-5-removebg-preview.png','Pedigree',1);
/*!40000 ALTER TABLE `homepage_partnercompany` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-08  6:43:51
