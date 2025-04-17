from rest_framework import serializers
from .models import Category, Service, ServicePackage, PackageInclusion
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

class PackageInclusionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageInclusion
        fields = ['id', 'name', 'description']

class ServicePackageSerializer(serializers.ModelSerializer):
    inclusions = PackageInclusionSerializer(many=True, read_only=True)
    
    class Meta:
        model = ServicePackage
        fields = ['id', 'name', 'price', 'duration', 'status', 'inclusions']

class ServiceSerializer(serializers.ModelSerializer):
    packages = ServicePackageSerializer(many=True, read_only=True)
    created_by = serializers.ReadOnlyField(source='created_by.username')
    
    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'image', 'status', 'packages', 'created_by', 'created_at', 'updated_at']

    def create(self, validated_data):
        request = self.context.get("request")
        category_instance = validated_data.pop("service_category_id", None)  # Use correct field name
        validated_data["service_category_id"] = category_instance  # Assign to correct field
        validated_data["created_by"] = request.user  # Ensure created_by is set
        return super().create(validated_data)