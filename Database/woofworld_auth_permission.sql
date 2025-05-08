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
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add contact form',7,'add_contactform'),(26,'Can change contact form',7,'change_contactform'),(27,'Can delete contact form',7,'delete_contactform'),(28,'Can view contact form',7,'view_contactform'),(29,'Can add address',8,'add_address'),(30,'Can change address',8,'change_address'),(31,'Can delete address',8,'delete_address'),(32,'Can view address',8,'view_address'),(33,'Can add address',9,'add_address'),(34,'Can change address',9,'change_address'),(35,'Can delete address',9,'delete_address'),(36,'Can view address',9,'view_address'),(37,'Can add category',10,'add_category'),(38,'Can change category',10,'change_category'),(39,'Can delete category',10,'delete_category'),(40,'Can view category',10,'view_category'),(41,'Can add event',11,'add_event'),(42,'Can change event',11,'change_event'),(43,'Can delete event',11,'delete_event'),(44,'Can view event',11,'view_event'),(45,'Can add past event images',12,'add_pasteventimages'),(46,'Can change past event images',12,'change_pasteventimages'),(47,'Can delete past event images',12,'delete_pasteventimages'),(48,'Can view past event images',12,'view_pasteventimages'),(49,'Can add blog',13,'add_blog'),(50,'Can change blog',13,'change_blog'),(51,'Can delete blog',13,'delete_blog'),(52,'Can view blog',13,'view_blog'),(53,'Can add category',14,'add_category'),(54,'Can change category',14,'change_category'),(55,'Can delete category',14,'delete_category'),(56,'Can view category',14,'view_category'),(57,'Can add comment',15,'add_comment'),(58,'Can change comment',15,'change_comment'),(59,'Can delete comment',15,'delete_comment'),(60,'Can view comment',15,'view_comment'),(61,'Can add webinar',16,'add_webinar'),(62,'Can change webinar',16,'change_webinar'),(63,'Can delete webinar',16,'delete_webinar'),(64,'Can view webinar',16,'view_webinar'),(65,'Can add category',17,'add_category'),(66,'Can change category',17,'change_category'),(67,'Can delete category',17,'delete_category'),(68,'Can view category',17,'view_category'),(69,'Can add service',18,'add_service'),(70,'Can change service',18,'change_service'),(71,'Can delete service',18,'delete_service'),(72,'Can view service',18,'view_service'),(73,'Can add category',19,'add_category'),(74,'Can change category',19,'change_category'),(75,'Can delete category',19,'delete_category'),(76,'Can view category',19,'view_category'),(77,'Can add product',20,'add_product'),(78,'Can change product',20,'change_product'),(79,'Can delete product',20,'delete_product'),(80,'Can view product',20,'view_product'),(81,'Can add breed',21,'add_breed'),(82,'Can change breed',21,'change_breed'),(83,'Can delete breed',21,'delete_breed'),(84,'Can view breed',21,'view_breed'),(85,'Can add dogs',22,'add_dogs'),(86,'Can change dogs',22,'change_dogs'),(87,'Can delete dogs',22,'delete_dogs'),(88,'Can view dogs',22,'view_dogs'),(89,'Can add hero',23,'add_hero'),(90,'Can change hero',23,'change_hero'),(91,'Can delete hero',23,'delete_hero'),(92,'Can view hero',23,'view_hero'),(93,'Can add partner company',24,'add_partnercompany'),(94,'Can change partner company',24,'change_partnercompany'),(95,'Can delete partner company',24,'delete_partnercompany'),(96,'Can view partner company',24,'view_partnercompany'),(97,'Can add navbar customization',25,'add_navbarcustomization'),(98,'Can change navbar customization',25,'change_navbarcustomization'),(99,'Can delete navbar customization',25,'delete_navbarcustomization'),(100,'Can view navbar customization',25,'view_navbarcustomization'),(101,'Can add navbar item',26,'add_navbaritem'),(102,'Can change navbar item',26,'change_navbaritem'),(103,'Can delete navbar item',26,'delete_navbaritem'),(104,'Can view navbar item',26,'view_navbaritem'),(105,'Can add otp model',27,'add_otpmodel'),(106,'Can change otp model',27,'change_otpmodel'),(107,'Can delete otp model',27,'delete_otpmodel'),(108,'Can view otp model',27,'view_otpmodel'),(109,'Can add about us',28,'add_aboutus'),(110,'Can change about us',28,'change_aboutus'),(111,'Can delete about us',28,'delete_aboutus'),(112,'Can view about us',28,'view_aboutus'),(113,'Can add client company',29,'add_clientcompany'),(114,'Can change client company',29,'change_clientcompany'),(115,'Can delete client company',29,'delete_clientcompany'),(116,'Can view client company',29,'view_clientcompany'),(117,'Can add contact details',30,'add_contactdetails'),(118,'Can change contact details',30,'change_contactdetails'),(119,'Can delete contact details',30,'delete_contactdetails'),(120,'Can view contact details',30,'view_contactdetails'),(121,'Can add cart',31,'add_cart'),(122,'Can change cart',31,'change_cart'),(123,'Can delete cart',31,'delete_cart'),(124,'Can view cart',31,'view_cart'),(125,'Can add order',32,'add_order'),(126,'Can change order',32,'change_order'),(127,'Can delete order',32,'delete_order'),(128,'Can view order',32,'view_order'),(129,'Can add order items',33,'add_orderitems'),(130,'Can change order items',33,'change_orderitems'),(131,'Can delete order items',33,'delete_orderitems'),(132,'Can view order items',33,'view_orderitems'),(133,'Can add notification',34,'add_notification'),(134,'Can change notification',34,'change_notification'),(135,'Can delete notification',34,'delete_notification'),(136,'Can view notification',34,'view_notification'),(137,'Can add product images',35,'add_productimages'),(138,'Can change product images',35,'change_productimages'),(139,'Can delete product images',35,'delete_productimages'),(140,'Can view product images',35,'view_productimages');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-08  6:43:55
