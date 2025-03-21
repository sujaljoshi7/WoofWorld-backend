from rest_framework import serializers
from .models import NavbarItem, NavbarCustomization
from django.utils import timezone
from user.serializers import UserSerializer
from django.contrib.auth.models import User


class NavbarItemSerializer(serializers.ModelSerializer):
    dropdown_parent = serializers.PrimaryKeyRelatedField(
        queryset=NavbarItem.objects.all(),  # Allows accepting ID instead of an object
        allow_null=True, required=False  # Allows setting it to null
    )
    dropdown_parent_data = serializers.SerializerMethodField()
    
    class Meta:
        model = NavbarItem
        fields = '__all__'
        # depth = 1 

    def get_dropdown_parent_data(self, obj):
        """Avoid recursion by only returning necessary fields"""
        if obj.dropdown_parent:
            return {
                "id": obj.dropdown_parent.id,
                "name": obj.dropdown_parent.title
            }  # Return only specific fields
        return None

    

class NavbarCustomizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = NavbarCustomization
        fields = '__all__'
