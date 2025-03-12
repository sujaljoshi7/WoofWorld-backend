from rest_framework import serializers
from .models import AboutUs
from django.utils import timezone
from user.serializers import UserSerializer
from django.contrib.auth.models import User


class AboutUsSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only = True)
    class Meta:
        model = AboutUs
        fields  = '__all__'

