from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    status = models.IntegerField()
    created_at = models.DateTimeField(default=now, editable=False)
    created_by = models.CharField(max_length=100)

class Event(models.Model):
    event_category_id = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='event')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user')
    name = models.CharField(max_length=100)
    description = models.TextField()
    date = models.CharField(max_length=12)
    time = models.CharField(max_length=12)
    location = models.CharField(max_length=100)
    price = models.FloatField()
    image = models.ImageField(upload_to='uploads/')
    duration = models.CharField(max_length=100)
    contact_name = models.CharField(max_length=100)
    contact_number = models.BigIntegerField()
    status = models.IntegerField()
    created_at = models.DateTimeField(default=now, editable=False)