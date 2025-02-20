from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Address, ContactDetails,ContactForm, ClientCompany, AboutUs, BlogCategory, Blog, BlogComment,EventCategory, Event, WebinarCategory, Webinar, NewsCategory, News, NewsComment, ProductCategory, Products, ServiceCategory, Service
from django.core.exceptions import ValidationError
from datetime import datetime

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","username","password", "first_name", "last_name", "email", "is_staff"]
        extra_kwargs = {"password":{"write_only": True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Update the last_login field
        user = self.user
        user.last_login = datetime.now()
        user.save()

        return data