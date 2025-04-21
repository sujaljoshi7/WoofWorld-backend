from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now

class Notification(models.Model):
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=50)
    is_read = models.BooleanField(default=False)
