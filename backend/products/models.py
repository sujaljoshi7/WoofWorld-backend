from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

class Category(models.Model):
    name = models.CharField(max_length=100)
    status = models.IntegerField()
    created_at = models.DateTimeField(default=datetime.now(), editable=False)
    created_by = models.CharField(max_length=100)

class Product(models.Model):
    product_category_id = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='product')
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.IntegerField()
    type = models.CharField(max_length=100)
    duration = models.CharField(max_length=100, default="")
    image = models.ImageField(upload_to='products/')
    status = models.IntegerField()
    created_at = models.DateTimeField(default=datetime.now(), editable=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='product_user')