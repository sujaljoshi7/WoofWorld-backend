from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from django.core.exceptions import ValidationError

def validate_image_size(value):
    limit = 5 * 1024 * 1024  # 5MB limit
    if value.size > limit:
        raise ValidationError("Image size should not exceed 5MB.")

class Category(models.Model):
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=2)
    created_at = models.DateTimeField(default=datetime.now(), editable=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_cat_user')

class Blog(models.Model):
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_author')
    title = models.CharField(max_length=100, default="")
    content = models.TextField()
    image = models.URLField(max_length=500)
    status = models.IntegerField()
    created_at = models.DateTimeField(default=datetime.now(), editable=False)


class Comment(models.Model):
    blog_id = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='blogcomment')
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blogusercomment')
    comment = models.CharField(max_length=100)
    status = models.CharField(max_length=2)
