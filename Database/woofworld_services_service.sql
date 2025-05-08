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
-- Table structure for table `services_service`
--

DROP TABLE IF EXISTS `services_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services_service` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `content` longtext NOT NULL,
  `image` varchar(200) NOT NULL,
  `status` int NOT NULL,
  `show_on_homepage` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by_id` int NOT NULL,
  `service_category_id_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `services_service_service_category_id__746c308d_fk_services_` (`service_category_id_id`),
  KEY `services_service_created_by_id_d0083628_fk_auth_user_id` (`created_by_id`),
  CONSTRAINT `services_service_created_by_id_d0083628_fk_auth_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `services_service_service_category_id__746c308d_fk_services_` FOREIGN KEY (`service_category_id_id`) REFERENCES `services_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services_service`
--

LOCK TABLES `services_service` WRITE;
/*!40000 ALTER TABLE `services_service` DISABLE KEYS */;
INSERT INTO `services_service` VALUES (1,'Dog Grooming','Our professional dog grooming service ensures your furry friend looks and feels their best. From haircuts and nail trimming to a deep-clean bath and ear cleaning, we offer full grooming sessions using pet-safe products. Our trained groomers provide gentle care, reducing anxiety and keeping hygiene top-notch. Whether your dog is long-haired or short-haired, we tailor the grooming to their breed and comfort. Book a session to pamper your pup and maintain their coat health, leaving them fresh, happy, and photo-ready!','https://i.ibb.co/cKMntBvT/grooming-pomeranian-dog-392339-197.jpg',1,1,'2025-04-17 13:12:44.433000',1,1),(2,'Puppy learning with a trainer','Start your dog’s journey with good behavior and confidence! Our puppy training classes are perfect for young dogs needing basic obedience skills like sit, stay, come, and leash manners. Experienced trainers use positive reinforcement techniques to build a strong bond between you and your pup. These sessions also promote socialization with other dogs, preventing future aggression or fear. Training lays the foundation for a happy, well-mannered companion. We welcome all breeds and customize based on your dog’s needs.','https://i.ibb.co/zWqMPpcB/dog-training-man-training-his-dog-park-min.jpg',1,1,'2025-04-17 13:12:44.433000',1,2),(3,'Veterinary Home Visits','Too busy to visit the clinic? Our certified veterinarians come to your doorstep for checkups, vaccinations, and minor treatments. Avoid the stress of travel and waiting rooms while ensuring your dog receives timely medical attention in the comfort of your home. This service is ideal for senior dogs, puppies, or dogs with mobility issues. We also provide basic diagnostics and post-surgery follow-ups. Keep your furry friend healthy without leaving your couch!','https://i.ibb.co/v4g7pnBz/attractive-caucasian-woman-working-with-boston-terrier-vet-s-office-female-veterinarian-checking-hea.jpg',1,1,'2025-04-17 14:31:50.688000',1,3);
/*!40000 ALTER TABLE `services_service` ENABLE KEYS */;
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
