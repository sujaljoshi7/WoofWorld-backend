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
    created_by = UserSerializer(read_only=True)
    category = ServiceCategorySerializer(source="service_category_id", read_only=True)  # Fetch full category details
    service_category_id = serializers.PrimaryKeyRelatedField(  # Ensure correct field name
        queryset=Category.objects.all(), write_only=True
    )

    class Meta:
        model = Service
        fields = '__all__'

    def create(self, validated_data):
        request = self.context.get("request")
        category_instance = validated_data.pop("service_category_id", None)  # Use correct field name
        validated_data["service_category_id"] = category_instance  # Assign to correct field
        validated_data["created_by"] = request.user  # Ensure created_by is set
        return super().create(validated_data)