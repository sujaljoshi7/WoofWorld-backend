from rest_framework import serializers
from .models import Category, Product, ProductImages
from django.utils import timezone
from user.serializers import UserSerializer
from django.contrib.auth.models import User
from adoption.serializers import BreedSerializer
from adoption.models import Breed


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields  = '__all__'

    def validate_name(self, value):
        value = value.strip()  # Remove leading/trailing spaces
        if Category.objects.filter(name__iexact=value).exists():  # Case-insensitive check
            raise serializers.ValidationError("Name already exists. Please use a different name.")
        return value

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImages
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only = True)
    category = ProductCategorySerializer(source="product_category_id", read_only=True)
    breeds = BreedSerializer(source="breed", read_only=True)
    product_category_id = serializers.PrimaryKeyRelatedField(
    queryset=Category.objects.all(), write_only=True)
    breed = serializers.PrimaryKeyRelatedField(
    queryset=Breed.objects.all(), write_only=True)

    class Meta:
        model = Product
        fields = '__all__'
    
    def create(self, validated_data):
        request = self.context.get("request")
        category_instance = validated_data.pop("product_category_id", None)
        breed_instance = validated_data.pop("breed", None)
        if category_instance:
            validated_data["product_category_id"] = category_instance
        if breed_instance:
            validated_data["breed"] = breed_instance
        validated_data["created_by"] = request.user
        return super().create(validated_data)

    def get_created_by(self, obj):
        return {
            "id": obj.created_by.id,
            "first_name": obj.created_by.first_name,
            "last_name": obj.created_by.last_name,
            "email": obj.created_by.email,
        }