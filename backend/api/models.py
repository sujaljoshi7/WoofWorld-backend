from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

class Address(models.Model):
    user_id = models.ForeignKey(User,on_delete=models.CASCADE, related_name='address')
    house_no = models.CharField(max_length=10)
    street = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    is_primary = models.BooleanField()
    status = models.CharField(max_length=1)
    created_at = models.DateTimeField(default=datetime.now(), editable=False)

    def __str__(self):
        return str(self.created_at)


class ContactDetails(models.Model):
    company_name = models.CharField(max_length=100)
    company_tagline = models.CharField(max_length=100)
    company_description = models.TextField()
    company_address = models.TextField()
    company_contact = models.CharField(max_length=10)
    company_logo = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=6)
    postal_code = models.CharField(max_length=6)
    social_links = models.JSONField()
    office_hours = models.CharField(max_length=50)
    google_map_url = models.CharField(max_length=500)
    established_year = models.CharField(max_length=10)

class ContactForm(models.Model):
    email = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    message = models.TextField()
    status = models.CharField(max_length=2)
    created_at = models.DateTimeField(default=datetime.now(), editable=False)

class ClientCompany(models.Model):
    company_name = models.CharField(max_length=100)
    company_logo = models.CharField(max_length=255)
    status = models.CharField(max_length=2)
    created_at = models.DateTimeField(default=datetime.now(), editable=False)

class AboutUs(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()

class BlogCategory(models.Model):
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=2)
    created_at = models.DateTimeField(default=datetime.now(), editable=False)

class Blog(models.Model):
    blog_category_id = models.ForeignKey(BlogCategory,on_delete=models.CASCADE, related_name='blog')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='author')
    image = models.CharField(max_length=255)
    content = models.TextField()
    status = models.CharField(max_length=2)
    created_at = models.DateTimeField(default=datetime.now(), editable=False)

class BlogComment(models.Model):
    blog_id = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='blogcomment')
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blogusercomment')
    comment = models.CharField(max_length=100)
    status = models.CharField(max_length=2)

class EventCategory(models.Model):
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=2)
    created_at = models.DateTimeField(default=datetime.now(), editable=False)

class Event(models.Model):
    event_category_id = models.ForeignKey(EventCategory, on_delete=models.CASCADE, related_name='event')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='userevent')
    name = models.CharField(max_length=100)
    description = models.TextField()
    date = models.CharField(max_length=12)
    time = models.CharField(max_length=12)
    location = models.CharField(max_length=100)
    price = models.IntegerField()
    image = models.CharField(max_length=255)
    duration = models.CharField(max_length=100)
    contact_name = models.CharField(max_length=100)
    contact_number = models.IntegerField()
    status = models.CharField(max_length=2)
    created_at = models.DateTimeField(default=datetime.now(), editable=False)

class WebinarCategory(models.Model):
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=2)
    created_at = models.DateTimeField(default=datetime.now(), editable=False)

class Webinar(models.Model):
    webinar_category_id = models.ForeignKey(WebinarCategory, on_delete=models.CASCADE, related_name='webinar')
    name = models.CharField(max_length=100)
    description = models.TextField()
    date = models.CharField(max_length=12)
    time = models.CharField(max_length=12)
    link = models.CharField(max_length=255)
    price = models.IntegerField()
    image = models.CharField(max_length=255)
    duration = models.CharField(max_length=100)
    contact_name = models.CharField(max_length=100)
    contact_number = models.IntegerField()
    status = models.CharField(max_length=2)
    created_at = models.DateTimeField(default=datetime.now(), editable=False)

class NewsCategory(models.Model):
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=2)
    created_at = models.DateTimeField(default=datetime.now(), editable=False)

class News(models.Model):
    news_category_id = models.ForeignKey(NewsCategory, on_delete=models.CASCADE, related_name='news')
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.CharField(max_length=255)
    status = models.CharField(max_length=2)
    created_at = models.DateTimeField(default=datetime.now(), editable=False)

class NewsComment(models.Model):
    news_id = models.ForeignKey(News, on_delete=models.CASCADE, related_name='newscomment')
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='newsusercomment')
    comment = models.CharField(max_length=100)
    status = models.CharField(max_length=2)

class ProductCategory(models.Model):
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=2)
    created_at = models.DateTimeField(default=datetime.now(), editable=False)

class Products(models.Model):
    product_category_id = models.ForeignKey(ProductCategory, on_delete=models.CASCADE, related_name='product')
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.IntegerField()
    brand = models.CharField(max_length=100)
    image = models.CharField(max_length=255)
    status = models.CharField(max_length=2)
    created_at = models.DateTimeField(default=datetime.now(), editable=False)

class ServiceCategory(models.Model):
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=2)
    created_at = models.DateTimeField(default=datetime.now(), editable=False)

class Service(models.Model):
    service_category_id = models.ForeignKey(ServiceCategory, on_delete=models.CASCADE, related_name='service')
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=2)
    created_at = models.DateTimeField(default=datetime.now(), editable=False)