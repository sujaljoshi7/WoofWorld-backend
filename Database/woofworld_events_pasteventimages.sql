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
-- Table structure for table `events_pasteventimages`
--

DROP TABLE IF EXISTS `events_pasteventimages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events_pasteventimages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image` varchar(500) NOT NULL,
  `event_id_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `events_pasteventimages_event_id_id_80efac6d_fk_events_event_id` (`event_id_id`),
  CONSTRAINT `events_pasteventimages_event_id_id_80efac6d_fk_events_event_id` FOREIGN KEY (`event_id_id`) REFERENCES `events_event` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events_pasteventimages`
--

LOCK TABLES `events_pasteventimages` WRITE;
/*!40000 ALTER TABLE `events_pasteventimages` DISABLE KEYS */;
INSERT INTO `events_pasteventimages` VALUES (5,'https://i.ibb.co/m5hVT1Qq/adoption-11.webp',1),(6,'https://i.ibb.co/RGQSFq2N/11b5866ac101.jpg',1),(7,'https://i.ibb.co/ymbD0GGV/1ffc070b215a.jpg',1),(8,'https://i.ibb.co/vrZ74gb/aa438c79008a.jpg',1),(9,'https://i.ibb.co/bgXLGSCY/100892e0f510.jpg',1);
/*!40000 ALTER TABLE `events_pasteventimages` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-08  6:43:57
