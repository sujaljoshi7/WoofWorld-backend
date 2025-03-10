from rest_framework import serializers
from .models import Webinar
from django.utils import timezone
from user.serializers import UserSerializer
from django.contrib.auth.models import User


class WebinarSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only = True)
    class Meta:
        model = Webinar
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
