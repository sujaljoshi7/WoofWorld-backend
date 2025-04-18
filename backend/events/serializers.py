from rest_framework import serializers
from .models import Category, Event, PastEventImages
from django.utils import timezone
from user.serializers import UserSerializer
from django.contrib.auth.models import User


class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields  = '__all__'

    def validate_name(self, value):
        value = value.strip()  # Remove leading/trailing spaces
        if Category.objects.filter(name__iexact=value).exists():  # Case-insensitive check
            raise serializers.ValidationError("Name already exists. Please use a different name.")
        return value
    
class PastEventImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PastEventImages
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only = True)
    category = EventCategorySerializer(source="event_category_id", read_only=True)
    event_category_id = serializers.PrimaryKeyRelatedField(
    queryset=Category.objects.all(), write_only=True)


    class Meta:
        model = Event
        fields  = '__all__'
    
    def create(self, validated_data):
        request = self.context.get("request")
        category_instance = validated_data.pop("event_category_id", None)  # Use correct field name
        if category_instance:
            validated_data["event_category_id"] = category_instance
        validated_data["created_by"] = request.user  # Ensure created_by is set
        return super().create(validated_data)

    def get_created_by(self, obj):
        return {
            "id": obj.created_by.id,
            "first_name": obj.created_by.first_name,
            "last_name": obj.created_by.last_name,
            "email": obj.created_by.email,
        }