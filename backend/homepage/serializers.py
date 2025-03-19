from rest_framework import serializers
from .models import Hero
from django.utils import timezone
from user.serializers import UserSerializer
from django.contrib.auth.models import User


class HeroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hero
        fields  = '__all__'
