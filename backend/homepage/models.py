from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from django.core.exceptions import ValidationError

def validate_image_size(value):
    limit = 5 * 1024 * 1024  # 5MB limit
    if value.size > limit:
        raise ValidationError("Image size should not exceed 5MB.")

class Hero(models.Model):
    image = models.ImageField(upload_to='hero/', validators=[validate_image_size])
    headline = models.CharField(max_length=100)
    subtext = models.CharField(max_length=201)
    cta = models.CharField(max_length=50)
    status = models.IntegerField()