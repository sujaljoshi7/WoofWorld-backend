from rest_framework import serializers
from .models import Breed, Dogs
from django.utils import timezone
from user.serializers import UserSerializer
from django.contrib.auth.models import User


class BreedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Breed
        fields  = '__all__'

    def validate_name(self, value):
        value = value.strip()  # Remove leading/trailing spaces
        if Breed.objects.filter(name__iexact=value).exists():  # Case-insensitive check
            raise serializers.ValidationError("Breed already exists. Please use a different breed.")
        return value

class DogsSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only = True)
    breed = BreedSerializer(read_only=True)  # For fetching breed details
    breed_id = serializers.PrimaryKeyRelatedField(
        queryset=Breed.objects.all(), write_only=True, source="breed"
    )  # For setting breed while saving

    class Meta:
        model = Dogs
        fields  = '__all__'
    
    def create(self, validated_data):
        request = self.context.get("request")
        breed_instance = validated_data.pop("breed", None)
        if breed_instance:
            validated_data["breed"] = breed_instance  # Ensure breed is correctly assigned
            validated_data["created_by"] = request.user
        return super().create(validated_data)

    def get_created_by(self, obj):
        return {
            "id": obj.created_by.id,
            "first_name": obj.created_by.first_name,
            "last_name": obj.created_by.last_name,
            "email": obj.created_by.email,
        }