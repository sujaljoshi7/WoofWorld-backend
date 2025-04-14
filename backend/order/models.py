from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now

class Order(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='order_user')
    total = models.FloatField()
    payment_status = models.IntegerField()
    payment_id = models.CharField(max_length=255, blank=True, null=True)
    order_status = models.IntegerField(default=1)
    order_id = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(default=now, editable=False)

class OrderItems(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='order_item_user')
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_item_user')
    item = models.IntegerField()
    type = models.IntegerField()
    quantity = models.IntegerField()