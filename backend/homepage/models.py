from django.db import models
from django.core.exceptions import ValidationError

def validate_image_size(value):
    limit = 5 * 1024 * 1024  # 5MB limit
    if value.size > limit:
        raise ValidationError("Image size should not exceed 5MB.")

class Hero(models.Model):
    image = models.URLField(max_length=500)
    headline = models.CharField(max_length=100)
    subtext = models.CharField(max_length=201)
    cta = models.CharField(max_length=50)
    url = models.CharField(max_length=100, default="")
    status = models.IntegerField()

class PartnerCompany(models.Model):
    image = models.URLField(max_length=500)
    name = models.CharField(max_length=100)
    status = models.IntegerField()