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
-- Table structure for table `events_event`
--

DROP TABLE IF EXISTS `events_event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events_event` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` longtext NOT NULL,
  `date` varchar(12) NOT NULL,
  `time` varchar(12) NOT NULL,
  `address_line_1` varchar(100) NOT NULL,
  `price` double NOT NULL,
  `image` varchar(500) NOT NULL,
  `duration` varchar(100) NOT NULL,
  `contact_name` varchar(100) NOT NULL,
  `contact_number` varchar(12) NOT NULL,
  `status` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by_id` int NOT NULL,
  `event_category_id_id` bigint NOT NULL,
  `address_line_2` varchar(100) DEFAULT NULL,
  `maps_link` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `events_event_created_by_id_2c28ea90_fk_auth_user_id` (`created_by_id`),
  KEY `events_event_event_category_id_id_e9671a68_fk_events_category_id` (`event_category_id_id`),
  CONSTRAINT `events_event_created_by_id_2c28ea90_fk_auth_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `events_event_event_category_id_id_e9671a68_fk_events_category_id` FOREIGN KEY (`event_category_id_id`) REFERENCES `events_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events_event`
--

LOCK TABLES `events_event` WRITE;
/*!40000 ALTER TABLE `events_event` DISABLE KEYS */;
INSERT INTO `events_event` VALUES (1,'Paws & Play Meetup','A fun-filled playdate for dogs and their owners.','2025-04-12','07:00','S K Farm, Rajpath Rangoli Rd',1000,'https://i.ibb.co/KxCygkSm/event-1743067376641-isommh.webp','4 hours','Ramesh Bhatt','9456712486',1,'2025-04-05 00:33:58.154000',1,1,'opposite Shivalik business centre, Rajiv Nagar, Ahmedabad, Gujarat 380058','https://maps.app.goo.gl/7qijDX1Y22HADFeTA'),(2,'Canine Health Workshop','Expert vets sharing tips on dog health & nutrition.','2025-04-19','19:00','Venue to be announced',750,'https://i.ibb.co/5gWkkfJY/event-1743066884237-pbb29z.webp','4 hours','Ramesh Bhatt','9456712486',1,'2025-04-05 18:40:49.719000',1,2,'',''),(3,'Puppy Adoption Drive','Find a loving home for rescued puppies.','2025-04-27','11:00','Venue to be announced',500,'https://i.ibb.co/j0qY7Df/event-1743067088188-ebz5ew.webp','3 hours','Ramesh Bhatt','9456712486',1,'2025-04-05 18:43:06.719000',1,3,'',''),(4,'Paws Parade 2025','Join us for a fun-filled dog show featuring contests, games, and more!','2025-04-15','09:00','Riverfront Park',400,'https://i.ibb.co/4Zd6j45m/Chat-GPT-Image-Apr-8-2025-03-08-03-PM.jpg','4 hours','Woof World Team','919876543210',1,'2025-04-08 14:38:16.725000',1,8,'Near Ellis Bridge, Ahmedabad','https://maps.google.com/?q=Riverfront+Park,+Ahmedabad'),(5,'Woof Wellness Camp','Free health checkup camp for dogs with expert vets.','2025-04-22','21:47','GMDC Ground',200,'https://i.ibb.co/TBTprJ60/adoption-13.webp','3 hours','Woof World Team','919876543210',1,'2025-04-08 14:50:30.012000',1,9,'University Road, Ahmedabad','https://maps.google.com/?q=GMDC+Ground,+Ahmedabad'),(6,'Adopt a Buddy','Find your furry companion and give them a forever home.','2025-04-29','10:00','Science City',499,'https://i.ibb.co/ksyMfQf0/adoption-11.webp','4 hours','WoofWorld Team','919876543210',1,'2025-04-08 14:52:19.232000',1,3,'Sola, Ahmedabad','https://maps.google.com/?q=Science+City,+Ahmedabad'),(7,'Tricks and Treats Workshop','Learn essential obedience and fun tricks for your dog.','2025-05-06','09:00','Kankaria Lake',500,'https://i.ibb.co/hpSNMZT/Chat-GPT-Image-Apr-8-2025-03-10-49-PM.jpg','5 hours','WoofWorld Team','919876543209',1,'2025-04-08 15:11:54.489000',1,7,'Maninagar, Ahmedabad','https://maps.google.com/?q=Kankaria+Lake,+Ahmedabad'),(8,'Canine Carnival','Enjoy games, food, and entertainment while supporting a great cause.','2025-05-13','10:00','Venue to be announced',450,'https://i.ibb.co/gZtTNMqh/Chat-GPT-Image-Apr-8-2025-03-15-45-PM.png','4 hours','WoofWorld Team','919876543210',1,'2025-04-08 15:17:58.212000',1,10,'Venue to be announced',''),(9,'Anounsing Soon','Exciting event details coming soon!','2025-05-13','22:00','Venue to be announced',500,'https://i.ibb.co/7dZNQ9yj/Chat-GPT-Image-Apr-8-2025-03-23-18-PM.png','5 hours','Woof World Team','919876543210',1,'2025-04-08 15:26:29.176000',1,11,'Venue to be announced',''),(10,'Anounsing Soon','Exciting event details coming soon!','2025-05-13','22:00','Venue to be announced',500,'https://i.ibb.co/7dZNQ9yj/Chat-GPT-Image-Apr-8-2025-03-23-18-PM.png','5 hours','Woof World Team','919876543210',1,'2025-04-08 15:26:29.484000',1,11,'Venue to be announced','');
/*!40000 ALTER TABLE `events_event` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-08  6:43:50
