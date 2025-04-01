from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now

class Cart(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_user')
    type = models.IntegerField()
    item = models.IntegerField()
    quantity = models.IntegerField(default=1)
    created_at = models.DateTimeField(default=now, editable=False)
