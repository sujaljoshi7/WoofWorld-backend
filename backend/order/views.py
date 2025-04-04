from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Order, OrderItems
from .serializers import OrderSerializer, OrderItemsSerializer
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from cart.models import Cart

class OrderCheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Fetch all orders of the authenticated user along with order items.
        """
        user = request.user
        orders = Order.objects.filter(user_id=user).order_by("-created_at")  # Latest orders first

        order_data = []
        for order in orders:
            order_items = OrderItems.objects.filter(order_id=order)
            order_items_serialized = OrderItemsSerializer(order_items, many=True).data

            order_data.append({
                "order": OrderSerializer(order).data,
                "order_items": order_items_serialized
            })

        return Response(order_data, status=status.HTTP_200_OK)

    @transaction.atomic  # Ensures all DB operations complete successfully or rollback
    def post(self, request):
        user = request.user
        cart_items = Cart.objects.filter(user_id=user)

        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate total price (assuming price is retrieved based on `item` ID)
        total_price = 0
        for cart_item in cart_items:
            total_price += cart_item.quantity * get_item_price(cart_item.item)  # Implement `get_item_price`

        # Create Order
        order = Order.objects.create(
            user_id=user,
            total=request.data.get("total_price"),
            payment_id = request.data.get("payment_id"),
            payment_status = request.data.get("payment_status"),
            order_id = request.data.get("order_id")
        )

        # Move cart items to order items
        order_items = [
            OrderItems(
                user_id=user,
                order_id=order,
                item=cart_item.item,
                type=cart_item.type,
                quantity=cart_item.quantity
            )
            for cart_item in cart_items
        ]
        OrderItems.objects.bulk_create(order_items)  # Bulk insert for efficiency

        # Clear user's cart after successful order placement
        cart_items.delete()

        return Response({"order_id": order.id, "message": "Order placed successfully"}, status=status.HTTP_201_CREATED)

# Helper function to get item price (Modify based on your product model)
def get_item_price(item_id):
    # Example: Fetch price from the database based on item_id
    from products.models import Product  # Replace with your actual Product model
    product = Product.objects.filter(id=item_id).first()
    return product.price if product else 0
