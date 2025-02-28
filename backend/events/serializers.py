from rest_framework import serializers
from .models import Category, Event
from django.utils import timezone


class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields  = '__all__'

    def validate_name(self, value):
        value = value.strip()  # Remove leading/trailing spaces
        if Category.objects.filter(name__iexact=value).exists():  # Case-insensitive check
            raise serializers.ValidationError("Name already exists. Please use a different name.")
        return value

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields  = '__all__'
    
    def get_created_by(self, obj):
        return {
            "id": obj.created_by.id,
            "first_name": obj.created_by.first_name,
            "last_name": obj.created_by.last_name,
            "email": obj.created_by.email,
        }