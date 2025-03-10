from django.db import models
from django.contrib.auth.models import User
from datetime import datetime


class Webinar(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    date = models.CharField(max_length=12)
    time = models.CharField(max_length=12)
    link = models.CharField(max_length=255)
    price = models.IntegerField()
    image = models.ImageField(upload_to='webinars/')
    contact_name = models.CharField(max_length=100)
    contact_number = models.BigIntegerField()
    status = models.IntegerField()
    created_at = models.DateTimeField(default=datetime.now(), editable=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='webinar_author')
