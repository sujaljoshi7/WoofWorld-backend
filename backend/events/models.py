from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now
from django.core.exceptions import ValidationError

def validate_image_size(value):
    limit = 5 * 1024 * 1024  # 5MB limit
    if value.size > limit:
        raise ValidationError("Image size should not exceed 5MB.")

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
    address_line_1 = models.CharField(max_length=100)
    address_line_2 = models.CharField(max_length=100, null=True, blank=True)
    maps_link = models.CharField(max_length=255, null=True, blank=True)
    price = models.FloatField()
    image = models.URLField(max_length=500)
    duration = models.CharField(max_length=100)
    contact_name = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=12)
    status = models.IntegerField()
    created_at = models.DateTimeField(default=now, editable=False)

class PastEventImages(models.Model):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='past_event_image')
    image = models.URLField(max_length=500)