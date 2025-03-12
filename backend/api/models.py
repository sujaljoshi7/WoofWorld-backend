from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

class Address(models.Model):
    user_id = models.ForeignKey(User,on_delete=models.CASCADE, related_name='address')
    house_no = models.CharField(max_length=10)
    street = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    is_primary = models.BooleanField()
    status = models.CharField(max_length=1)
    created_at = models.DateTimeField(default=datetime.now(), editable=False)

    def __str__(self):
        return str(self.created_at)




class ContactForm(models.Model):
    email = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    message = models.TextField()
    status = models.CharField(max_length=2)
    created_at = models.DateTimeField(default=datetime.now(), editable=False)



