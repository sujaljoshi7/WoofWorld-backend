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
-- Table structure for table `adoption_dogs`
--

DROP TABLE IF EXISTS `adoption_dogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adoption_dogs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `age` double NOT NULL,
  `gender` varchar(12) NOT NULL,
  `disease` varchar(100) NOT NULL,
  `color` varchar(100) NOT NULL,
  `personality` varchar(100) NOT NULL,
  `image` varchar(500) NOT NULL,
  `looking_for` longtext NOT NULL,
  `weight` double NOT NULL,
  `energy_level` varchar(10) NOT NULL,
  `vaccinated_status` varchar(30) NOT NULL,
  `status` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `breed_id` bigint NOT NULL,
  `created_by_id` int NOT NULL,
  `views` int NOT NULL,
  `dog_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dog_id` (`dog_id`),
  KEY `adoption_dogs_breed_id_1b5dca4b_fk_adoption_breed_id` (`breed_id`),
  KEY `adoption_dogs_created_by_id_234626b1_fk_auth_user_id` (`created_by_id`),
  CONSTRAINT `adoption_dogs_breed_id_1b5dca4b_fk_adoption_breed_id` FOREIGN KEY (`breed_id`) REFERENCES `adoption_breed` (`id`),
  CONSTRAINT `adoption_dogs_created_by_id_234626b1_fk_auth_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adoption_dogs`
--

LOCK TABLES `adoption_dogs` WRITE;
/*!40000 ALTER TABLE `adoption_dogs` DISABLE KEYS */;
INSERT INTO `adoption_dogs` VALUES (1,'Bubbaa',0.8,'Female','NA','Black & Golden','Friendly, playful, and highly affectionate','https://i.ibb.co/mVW7zDR0/Bubba-F-jpeg.webp','A loving family with an active lifestyle and space to play',30,'High','Fully Vaccinated',1,'2025-04-04 22:34:23.855000',4,1,0,NULL),(2,'Pasta',0.6,'Female','NA','Cream','Curious, intelligent, and loves companionship','https://i.ibb.co/8nWf1b4n/Pasta-jpeg.webp','A home with lots of cuddles and daily walks',12,'Medium','Fully Vaccinated',1,'2025-04-05 01:11:39.337000',4,1,0,NULL),(3,'Kuki',0.9,'Female','NA','Black & Gold','Always curious, Loyal, Alert, Silly','https://i.ibb.co/KcwM1qYJ/kuki.jpg','Friendly Environment',10,'Medium','Fully Vaccinated',1,'2025-04-08 12:11:12.110000',3,1,0,NULL),(4,'Eddie',11,'Male','NA','Gold','Active, Playfull, Loves Cuddles','https://i.ibb.co/n88wVY93/https-7d283b594b06c43ac98601aad911cc26-cdn-bubble-io-f1740931217551x138778157989908560.jpg','Safe Household',20,'High','Fully Vaccinated',1,'2025-04-08 12:33:27.612000',12,1,1,NULL),(5,'Daisy',1.5,'Female','NA','Golden','Friendly, Loving, Playfull','https://i.ibb.co/tMJsk7Xs/dog-adoption-ahmedabad-1732267898-3506839765715547439-29336109700.jpg','Friendly Home',22,'High','Fully Vaccinated',1,'2025-04-08 12:38:51.030000',13,1,3,NULL),(6,'Scout',2,'Male','NA','Golden','Shy, Loves to stay inside House','https://i.ibb.co/tp5WHnKp/Whats-App-Image-2025-04-08-at-12-35-22-3e52eea1.jpg','Loving Household',25,'Medium','Partially Vaccinated',1,'2025-04-08 12:43:07.562000',13,1,2,NULL),(7,'Nacho',4,'Male','NA','Cream / Fawn','Always curious, Happiest Lounging all day','https://i.ibb.co/wrRrpRgv/nacho.jpg','New Home with Friendly Environment',15,'Medium','Not Vaccinated',1,'2025-04-08 12:52:29.417000',14,1,0,NULL),(8,'Ludo',7,'Male','Sometimes His Joints Gets Stiff','Mixed Colour','Couch Potato, Likes Doing Things Their Own Way','https://i.ibb.co/Xxx4Y7ZK/Ludo.jpg','Home',28,'Medium','Fully Vaccinated',1,'2025-04-08 12:56:10.118000',9,1,4,NULL),(9,'Zues',10,'Female','Excessive licking of back paw','Cream','Playfull with Everyone','https://i.ibb.co/0pnsXh2t/Zues.jpg','Healthy Household',20,'Medium','Fully Vaccinated',1,'2025-04-08 13:02:44.839000',10,1,6,NULL),(10,'Ares',6,'Male','NA','White & Black','Friendly, Loving, Playfull','https://i.ibb.co/cXNJt6W7/https-7d283b594b06c43ac98601aad911cc26-cdn-bubble-io-f1743245635350x477214202111560800.jpg','Looking For Home Full of High Energy',30,'High','Fully Vaccinated',1,'2025-04-08 16:54:04.105000',5,1,85,NULL);
/*!40000 ALTER TABLE `adoption_dogs` ENABLE KEYS */;
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
