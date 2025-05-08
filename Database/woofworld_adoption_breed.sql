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
-- Table structure for table `adoption_breed`
--

DROP TABLE IF EXISTS `adoption_breed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adoption_breed` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `status` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adoption_breed`
--

LOCK TABLES `adoption_breed` WRITE;
/*!40000 ALTER TABLE `adoption_breed` DISABLE KEYS */;
INSERT INTO `adoption_breed` VALUES (1,'Beagle',1,'2025-04-04 22:31:57.224000'),(2,'Labrador Retriever',1,'2025-04-05 00:54:47.886000'),(3,'German Shepherd',1,'2025-04-05 01:00:02.632000'),(4,'Indie (Indian Pariah Dog)',1,'2025-04-05 01:00:24.512000'),(5,'Siberian Husky',1,'2025-04-05 01:00:32.356000'),(6,'All Breeds',1,'2025-04-05 01:00:43.057000'),(7,'Shih Tzu',1,'2025-04-05 01:00:50.048000'),(8,'Street Dog',1,'2025-04-05 01:01:00.269000'),(9,'Mix Breed',1,'2025-04-05 01:01:11.245000'),(10,'Pug',1,'2025-04-05 01:01:17.739000'),(11,'Rottewiler',1,'2025-04-05 01:01:24.394000'),(12,'Labrador',1,'2025-04-08 12:30:24.354000'),(13,'Golden Retiever',1,'2025-04-08 12:37:07.612000'),(14,'French Bull',1,'2025-04-08 12:48:51.729000');
/*!40000 ALTER TABLE `adoption_breed` ENABLE KEYS */;
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
