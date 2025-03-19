from django.db import models
from django.contrib.auth.models import User
from datetime import datetime


class Category(models.Model):
    name = models.CharField(max_length=100)
    status = models.IntegerField()
    created_at = models.DateTimeField(default=datetime.now(), editable=False)
    created_by = models.CharField(max_length=100)

class Service(models.Model):
    service_category_id = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='service_cat')
    name = models.CharField(max_length=100)
    content = models.TextField()
    image = models.ImageField(upload_to='services/')
    status = models.IntegerField()
    created_at = models.DateTimeField(default=datetime.now(), editable=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='service_user')