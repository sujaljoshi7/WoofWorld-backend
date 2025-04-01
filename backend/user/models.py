from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

class Address(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE, related_name='user_address')
    name = models.CharField(max_length=100, default="")
    address_line_1 = models.CharField(max_length=255, default="")
    address_line_2 = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=10)
    phone = models.CharField(max_length=10, default="")
    created_at = models.DateTimeField(default=datetime.now(), editable=False)