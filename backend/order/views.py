from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Order, OrderItems
from .serializers import OrderSerializer, OrderItemsSerializer, ProductSerializer
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from cart.models import Cart
from products.models import Product
from rest_framework.permissions import IsAdminUser


class OrderCheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Fetch all orders of the authenticated user along with order items and product details.
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

        # Calculate total price
        # total_price = 0
        # for cart_item in cart_items:
        #     if cart_item.type == 1:  # If it's a product
        #         try:
        #             product = Product.objects.get(id=cart_item.item)
        #             total_price += cart_item.quantity * product.price
        #         except Product.DoesNotExist:
        #             return Response({"error": f"Product with ID {cart_item.item} not found"}, status=status.HTTP_400_BAD_REQUEST)

        # Create Order
        order = Order.objects.create(
            user_id=user,
            total=request.data.get("total_price"),
            payment_id=request.data.get("payment_id"),
            payment_status=request.data.get("payment_status"),
            order_id=request.data.get("order_id")
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

class AllOrdersAdminView(APIView):
    permission_classes = [IsAdminUser]  # Only admin users can access this

    def get(self, request):
        """
        Fetch all orders (admin only), including order items and product details.
        """
        orders = Order.objects.all().order_by("-created_at")
        order_data = []

        for order in orders:
            order_items = OrderItems.objects.filter(order_id=order)
            order_items_serialized = OrderItemsSerializer(order_items, many=True).data

            order_data.append({
                "order": OrderSerializer(order).data,
                "order_items": order_items_serialized
            })

        return Response(order_data, status=status.HTTP_200_OK)

class OrderDetailsView(APIView):
    permission_classes = [IsAdminUser]  # Only admin users can access this

    def get(self, request, order_id):
        """
        Fetch detailed information about a specific order, including all order items and their details.
        """
        try:
            order = Order.objects.get(id=order_id)
            order_items = OrderItems.objects.filter(order_id=order)
            
            # Get order items with their details
            order_items_data = []
            for item in order_items:
                item_data = OrderItemsSerializer(item).data
                if item.type == 1:  # Product
                    try:
                        product = Product.objects.get(id=item.item)
                        item_data['product_details'] = ProductSerializer(product).data
                    except Product.DoesNotExist:
                        item_data['product_details'] = None
                order_items_data.append(item_data)

            # Prepare the response data
            response_data = {
                'order': OrderSerializer(order).data,
                'order_items': order_items_data,
                'user': {
                    'id': order.user_id.id,
                    'username': order.user_id.username,
                    'email': order.user_id.email,
                    'address': {
                        'name': order.user_id.address.name,
                        'address_line_1': order.user_id.address.address_line_1,
                        'address_line_2': order.user_id.address.address_line_2,
                        'city': order.user_id.address.city,
                        'state': order.user_id.address.state,
                        'zip_code': order.user_id.address.zip_code,
                        'country': order.user_id.address.country
                    }
                }
            }

            return Response(response_data, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
