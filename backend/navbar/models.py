from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from django.core.exceptions import ValidationError


class NavbarItem(models.Model):
    title = models.CharField(max_length=100)
    url = models.CharField(max_length=255)
    order = models.IntegerField(default=0)
    component = models.CharField(max_length=100, default="")
    dropdown_parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE)
    status = models.IntegerField()

class NavbarCustomization(models.Model):
    logo = models.ImageField(upload_to='logos/', null=True, blank=True)
    background_color = models.CharField(max_length=20, default="#ffffff")
    text_color = models.CharField(max_length=20, default="#000000")
    hover_color = models.CharField(max_length=20, default="#f5f5f5")
    layout = models.CharField(
        max_length=20,
        choices=[('left', 'Left'), ('center', 'Center'), ('right', 'Right')],
        default='left'
    )
    enable_search = models.BooleanField(default=True)
    enable_cart = models.BooleanField(default=False)