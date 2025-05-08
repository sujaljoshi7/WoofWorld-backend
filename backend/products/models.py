from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from adoption.models import Breed
from django.core.exceptions import ValidationError

def validate_image_size(value):
    limit = 5 * 1024 * 1024  # 5MB limit
    if value.size > limit:
        raise ValidationError("Image size should not exceed 5MB.")

class Category(models.Model):
    name = models.CharField(max_length=100)
    status = models.IntegerField()
    created_at = models.DateTimeField(default=datetime.now(), editable=False)
    created_by = models.CharField(max_length=100)

class Product(models.Model):
    product_category_id = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='product', default="")
    breed = models.ForeignKey(Breed, on_delete=models.CASCADE, related_name='product_breed', default=1)
    name = models.CharField(max_length=100, null=False, blank=False)
    description = models.TextField()
    price = models.IntegerField()
    company = models.CharField(max_length=255, default="")
    age = models.CharField(max_length=100, default="")
    weight = models.CharField(max_length=100, null=True, blank=True)
    image = models.URLField(max_length=500, default="")
    sku = models.CharField(max_length=100, default="", null=True, blank=True)
    status = models.IntegerField()
    show_on_homepage = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=datetime.now(), editable=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='product_user', default="")

class ProductImages(models.Model):
    Product_id = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='prroduct_images', default="")
    image = models.URLField(max_length=500)