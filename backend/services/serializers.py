from rest_framework import serializers
from .models import Category, Service
from django.utils import timezone
from user.serializers import UserSerializer
from django.contrib.auth.models import User


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields  = '__all__'

    def validate_name(self, value):
        value = value.strip()  # Remove leading/trailing spaces
        if Category.objects.filter(name__iexact=value).exists():  # Case-insensitive check
            raise serializers.ValidationError("Name already exists. Please use a different name.")
        return value

class ServiceSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only = True)

    class Meta:
        model = Service
        fields  = '__all__'
    
    def create(self, validated_data):
        request = self.context.get("request")
        validated_data["created_by"] = request.user
        return super().create(validated_data)

    def get_created_by(self, obj):
        return {
            "id": obj.created_by.id,
            "first_name": obj.created_by.first_name,
            "last_name": obj.created_by.last_name,
            "email": obj.created_by.email,
        }