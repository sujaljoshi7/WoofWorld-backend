from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Category, Event
from .serializers import EventCategorySerializer, EventSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def event_category(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = EventCategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = EventCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def event(request):
    if request.method == 'GET':
        events = Event.objects.select_related("created_by").all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def activate_category(request, category_id):
    try:
        category = Category.objects.get(id=category_id)
        category.status = True
        category.save(update_fields=["status"])
        return Response({"message": "Category activated successfully!"}, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({"error": "Category not found!"}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def deactivate_category(request, category_id):
    try:
        category = Category.objects.get(id=category_id)
        category.status = False
        category.save(update_fields=["status"])
        return Response({"message": "Category deactivated successfully!"}, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({"error": "Category not found!"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def activate_event(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
        event.status = True
        event.save(update_fields=["status"])
        return Response({"message": "Event activated successfully!"}, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({"error": "Event not found!"}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def deactivate_event(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
        event.status = False
        event.save(update_fields=["status"])
        return Response({"message": "Event deactivated successfully!"}, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({"error": "Event not found!"}, status=status.HTTP_404_NOT_FOUND)