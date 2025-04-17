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
        # Get the user from the request context
        user = self.context['request'].user
        
        # Create the service with the user
        service = Service.objects.create(
            name=validated_data.get('name'),
            description=validated_data.get('description'),
            image=validated_data.get('image'),
            status=validated_data.get('status', True),
            created_by=user
        )
        
        return service