from rest_framework import serializers
from .models import Hero, PartnerCompany
from django.utils import timezone
from user.serializers import UserSerializer
from django.contrib.auth.models import User


class HeroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hero
        fields  = '__all__'

class PartnerCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerCompany
        fields = '__all__'