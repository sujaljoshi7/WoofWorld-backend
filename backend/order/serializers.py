from rest_framework import serializers
from .models import Order, OrderItems
from products.serializers import ProductSerializer
from products.models import Product
from events.models import Event
from user.models import Address
from user.serializers import AddressSerializer
from events.models import Event
from events.serializers import EventSerializer

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'user_id', 'total', 'payment_status', 'payment_id', 'created_at', 'order_id', 'order_status']
        read_only_fields = ['id', 'created_at']  # Prevent users from modifying these fields


class OrderItemsSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    event = serializers.SerializerMethodField()

    class Meta:
        model = OrderItems
        fields = ['id', 'user_id', 'order_id', 'item', 'type', 'quantity', 'product', 'event']
        read_only_fields = ['id']  # Prevent modification of ID

    def get_product(self, obj):
        if obj.type == 1:  # If it's a product
            try:
                product = Product.objects.get(id=obj.item)
                return ProductSerializer(product).data
            except Product.DoesNotExist:
                return None
        
        return None
    
    def get_event(self, obj):
        if obj.type == 2:
            try:
                event = Event.objects.get(id=obj.item)
                return EventSerializer(event).data
            except Event.DoesNotExist:
                return None
        return None


