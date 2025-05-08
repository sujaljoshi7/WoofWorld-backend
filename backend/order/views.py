from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Order, OrderItems
from events.models import Event
from .serializers import OrderSerializer, OrderItemsSerializer, ProductSerializer
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from cart.models import Cart
from products.models import Product
from rest_framework.permissions import IsAdminUser
from django.db.models import Count, Sum
from django.db.models.functions import TruncMonth
from django.utils import timezone
from django.contrib.auth.models import User
from decimal import Decimal
from django.utils.timezone import now


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
            order_id=request.data.get("order_id"),
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
                elif item.type == 2:  # Event
                    try:
                        event = Event.objects.get(id=item.item)
                        item_data['event_details'] = {
                            'id': event.id,
                            'title': event.name,
                            'description': event.description,
                            'date': event.date,
                            'time': event.time,
                            'location': event.address_line_1 + " " + event.address_line_2,
                            'price': event.price,
                            'image': event.image if event.image else None
                        }
                    except Event.DoesNotExist:
                        item_data['event_details'] = None
                order_items_data.append(item_data)

            # Get the user's address
            user_address = order.user_id.user_address.first()
            
            # Prepare the response data
            response_data = {
                'order': OrderSerializer(order).data,
                'order_items': order_items_data,
                'user': {
                    'id': order.user_id.id,
                    'username': order.user_id.username,
                    'email': order.user_id.email,
                    'first_name': order.user_id.first_name,
                    'last_name': order.user_id.last_name,
                    'address': {
                        'name': user_address.name if user_address else None,
                        'address_line_1': user_address.address_line_1 if user_address else None,
                        'address_line_2': user_address.address_line_2 if user_address else None,
                        'city': user_address.city if user_address else None,
                        'state': user_address.state if user_address else None,
                        'postal_code': user_address.postal_code if user_address else None,
                        'country': user_address.country if user_address else None,
                        'phone': user_address.phone if user_address else None
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

class DashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        try:
            current_date = now()
            current_year = current_date.year
            current_month = current_date.month
            # Get total orders count
            monthly_orders  = Order.objects.filter(created_at__year=current_year, created_at__month=current_month)
            print(current_month)
            print(monthly_orders)
            total_orders = monthly_orders.count()
            
            # Get total revenue and format it in Indian currency
            total_revenue = monthly_orders.aggregate(total=Sum('total'))['total'] or 0
            
            # Format revenue in Indian number format
            def format_indian_currency(amount):
            
                amount_str = f"{amount:,.2f}"
                parts = amount_str.split('.')
                integer_part = parts[0].replace(',', '')
                decimal_part = parts[1]

                # Format using Indian number system
                if len(integer_part) > 3:
                    last_three = integer_part[-3:]
                    rest = integer_part[:-3]
                    rest = list(reversed(rest))
                    groups = [rest[i:i+2] for i in range(0, len(rest), 2)]
                    formatted = ','.join([''.join(reversed(group)) for group in groups[::-1]]) + ',' + last_three
                else:
                    formatted = integer_part
                
                return f"₹{formatted}.{decimal_part}"
            
            formatted_revenue = format_indian_currency(total_revenue)
            
            # Get total products
            total_products = Product.objects.count()
            
            # Get total users
            total_users = User.objects.count()
            
            # Get orders by status (using order_status instead of status)
            orders_by_status = Order.objects.values('order_status').annotate(count=Count('id'))
            
            # Map order status numbers to readable names
            status_map = {
                1: 'Placed',
                2: 'Processing',
                3: 'Shipped',
                4: 'Out for Delivery',
                5: 'Delivered',
                6: 'Cancelled'
            }
            
            # Format orders by status with readable names
            formatted_orders_by_status = []
            for status in orders_by_status:
                formatted_orders_by_status.append({
                    'status': status_map.get(status['order_status'], 'Unknown'),
                    'count': status['count']
                })
            
            # Get top selling products
            top_products = OrderItems.objects.filter(type=1).values(
                'item'
            ).annotate(
                total_quantity=Sum('quantity')
            ).order_by('-total_quantity')[:5]
            
            # Get product details for top selling products
            product_details = []
            for product in top_products:
                try:
                    product_obj = Product.objects.get(id=product['item'])
                    product_details.append({
                        'name': product_obj.name,
                        'quantity': product['total_quantity'],
                        'image': product_obj.image
                    })
                except Product.DoesNotExist:
                    continue
            
            # Get monthly orders for the last 6 months
            six_months_ago = timezone.now() - timezone.timedelta(days=180)
            monthly_orders = Order.objects.filter(
                created_at__gte=six_months_ago
            ).annotate(month=TruncMonth('created_at')
            ).values('month').annotate(
                count=Count('id')
            ).order_by('month')
            
            # Format monthly data
            monthly_data = []
            for order in monthly_orders:
                monthly_data.append({
                    'month': order['month'].strftime('%b %Y'),
                    'orders': order['count']
                })

            response_data = {
                'stats': {
                    'total_orders': total_orders,
                    'total_revenue': formatted_revenue,
                    'total_products': total_products,
                    'total_users': total_users
                },
                'orders_by_status': formatted_orders_by_status,
                'top_products': product_details,
                'monthly_orders': monthly_data
            }

            return Response(response_data)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=500
            )

class UpdateOrderStatusView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, order_id):
        try:
            order = get_object_or_404(Order, id=order_id)
            new_status = request.data.get('order_status')
            
            if new_status is None:
                return Response(
                    {"error": "Order status is required"},
                    status=400
                )
            
            # Validate status value
            # if new_status not in [1, 2, 3, 4, 5]:
            #     return Response(
            #         {"error": "Invalid order status"},
            #         status=400
            #     )
            
            # Update order status
            order.order_status = new_status
            order.save()
            
            return Response({
                "message": "Order status updated successfully",
                "order_id": order.id,
                "new_status": new_status
            })
            
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=404
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=500
            )
