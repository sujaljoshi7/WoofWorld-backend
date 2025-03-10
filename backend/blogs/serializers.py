from rest_framework import serializers
from .models import Blog, Category, Comment
from django.utils import timezone
from user.serializers import UserSerializer
from django.contrib.auth.models import User


class BlogCategorySerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only = True)
    class Meta:
        model = Category
        fields  = '__all__'

    def validate_name(self, value):
        value = value.strip()  # Remove leading/trailing spaces
        if Category.objects.filter(name__iexact=value).exists():  # Case-insensitive check
            raise serializers.ValidationError("Category already exists. Please use a different name.")
        return value
    
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

class BlogSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only = True)

    class Meta:
        model = Blog
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
    

class BlogCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields  = '__all__'