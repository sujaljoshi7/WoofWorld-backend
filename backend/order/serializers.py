from rest_framework import serializers
from .models import Order, OrderItems

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'user_id', 'total', 'payment_status', 'payment_id', 'created_at']
        read_only_fields = ['id', 'created_at']  # Prevent users from modifying these fields


class OrderItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItems
        fields = ['id', 'user_id', 'order_id', 'item', 'type', 'quantity']
        read_only_fields = ['id']  # Prevent modification of ID
