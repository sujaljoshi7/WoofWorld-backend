from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Webinar
from .serializers import WebinarSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404


@api_view(['GET', 'POST', 'PATCH'])
@permission_classes([IsAuthenticated])
def webinar(request, **kwargs):
    if request.method == 'GET':
        webinars = Webinar.objects.select_related("created_by").all()
        serializer = WebinarSerializer(webinars, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        data = request.data.copy()
        data['created_by'] = request.user.id
        serializer = WebinarSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'PATCH':
        id = kwargs.get("id")
        data = request.data.copy()
        data['created_by'] = request.user.id
        try:
            webinar = Webinar.objects.get(id=id)
        except Webinar.DoesNotExist:
            return Response({"error": "Webinar not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = WebinarSerializer(webinar, data=request.data, partial=True)  # Use partial=True for PATCH
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def activate_webinar(request, webinar_id):
    try:
        webinar = Webinar.objects.get(id=webinar_id)
        webinar.status = True
        webinar.save(update_fields=["status"])
        return Response({"message": "Webinar activated successfully!"}, status=status.HTTP_200_OK)
    except Webinar.DoesNotExist:
        return Response({"error": "Webinar not found!"}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def deactivate_webinar(request, webinar_id):
    try:
        webinar = Webinar.objects.get(id=webinar_id)
        webinar.status = False
        webinar.save(update_fields=["status"])
        return Response({"message": "Webinar deactivated successfully!"}, status=status.HTTP_200_OK)
    except Webinar.DoesNotExist:
        return Response({"error": "Webinar not found!"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_specific_webinar_data(request, webinar_id):
    webinar = get_object_or_404(Webinar, id=webinar_id)
    serializer = WebinarSerializer(webinar)  # Use your serializer directly
    return Response(serializer.data, status=status.HTTP_200_OK)