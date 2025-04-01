from rest_framework import serializers
from .models import Cart
from django.utils import timezone
from user.serializers import UserSerializer
from django.contrib.auth.models import User
from products.models import Product
from events.models import Event
from products.serializers import ProductSerializer
from events.serializers import EventSerializer


class CartSerializer(serializers.ModelSerializer):
    item_data = serializers.SerializerMethodField()
    class Meta:
        model = Cart
        fields  = '__all__'
    

    def get_item_data(self, obj):
        try:
            if obj.type == 1:
                # Handle fetching from Product model
                product = Product.objects.get(id=obj.item)
                return ProductSerializer(product).data
            elif obj.type == 2:
                # Handle fetching from Event model
                event = Event.objects.get(id=obj.item)
                return EventSerializer(event).data
        except (Product.DoesNotExist, Event.DoesNotExist):
            return None  # You can return a custom response here or an empty dictionary
        return None