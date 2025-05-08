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
-- Table structure for table `homepage_hero`
--

DROP TABLE IF EXISTS `homepage_hero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `homepage_hero` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image` varchar(500) NOT NULL,
  `headline` varchar(100) NOT NULL,
  `subtext` varchar(201) NOT NULL,
  `cta` varchar(50) NOT NULL,
  `status` int NOT NULL,
  `url` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `homepage_hero`
--

LOCK TABLES `homepage_hero` WRITE;
/*!40000 ALTER TABLE `homepage_hero` DISABLE KEYS */;
INSERT INTO `homepage_hero` VALUES (1,'https://i.ibb.co/7JHtJb6j/young-couple-with-cute-dog.jpg','Find, Adopt & Celebrate Dogs with WoofWorld!','Join India\'s #1 dog community! Explore events, adopt pups, and access top pet services.','Adopt A Dog',1,'/adoption'),(2,'https://i.ibb.co/rGhzbD5y/side-view-dog-woman-hand-shaking-park.jpg','Join the Best Dog Events in Your City!','Discover exciting dog-friendly meetups, festivals, and training workshops across India.','Explore Events',1,'/events/upcoming'),(3,'https://i.ibb.co/xKnFfyZr/young-woman-hugging-her-pitbull.jpg','Paws & Play Meetup','A fun-filled playdate for dogs and their owners....','Buy Tickets',1,'/events/upcoming');
/*!40000 ALTER TABLE `homepage_hero` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-08  6:43:56
