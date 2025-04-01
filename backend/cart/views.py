from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Cart
from .serializers import CartSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView


class CartView(APIView):

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]  # Changed to require authentication for GET
        return [IsAuthenticated()]

    def get(self, request):
        # Filter cart items to only include those belonging to the current user
        items = Cart.objects.filter(user_id=request.user.id).select_related("user_id")
        serializer = CartSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data.copy()
        data['user_id'] = request.user.id
        
        serializer = CartSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        item_id = request.data.get('item_id')
        quantity = request.data.get('quantity')
        
        if not item_id or quantity is None:
            return Response({'error': 'item_id and quantity are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            item = Cart.objects.get(id=item_id, user_id=request.user.id)
            item.quantity = quantity  # Update quantity
            item.save()
            serializer = CartSerializer(item)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Cart.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    

    def delete(self, request):
        item_id = request.data.get('item_id')  # Extract from request body
        if not item_id:
            return Response({'error': 'item_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            item = Cart.objects.get(id=item_id, user_id=request.user.id)
            item.delete()
            return Response({'message': 'Item deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Cart.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

    
