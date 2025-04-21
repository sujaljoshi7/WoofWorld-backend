from rest_framework import serializers
from .models import Notification
from django.utils import timezone
from user.serializers import UserSerializer
from django.contrib.auth.models import User
from adoption.serializers import BreedSerializer
from adoption.models import Breed


class NotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification
        fields = '__all__'
