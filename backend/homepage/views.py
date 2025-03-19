from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Hero
from .serializers import HeroSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404



@api_view(['GET', 'POST', 'PATCH'])
@permission_classes([AllowAny])
def hero(request, **kwargs):
    if request.method == 'GET':
        hero = Hero.objects.all()
        serializer = HeroSerializer(hero, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = HeroSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'PATCH':
        id = kwargs.get("id")
        data = request.data.copy()
        data['created_by'] = request.user.id
        try:
            hero = Hero.objects.get(id=id)
        except Hero.DoesNotExist:
            return Response({"error": "Hero not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def activate_hero(request, hero_id):
    try:
        hero = Hero.objects.get(id=hero_id)
        hero.status = True
        hero.save(update_fields=["status"])
        return Response({"message": "Hero activated successfully!"}, status=status.HTTP_200_OK)
    except Hero.DoesNotExist:
        return Response({"error": "Hero not found!"}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def deactivate_hero(request, hero_id):
    try:
        hero = Hero.objects.get(id=hero_id)
        hero.status = False
        hero.save(update_fields=["status"])
        return Response({"message": "Hero deactivated successfully!"}, status=status.HTTP_200_OK)
    except Hero.DoesNotExist:
        return Response({"error": "Hero not found!"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_specific_hero_data(request, hero_id):
    hero = get_object_or_404(Hero, id=hero_id)
    serializer = HeroSerializer(hero)  # Use your serializer directly
    return Response(serializer.data, status=status.HTTP_200_OK)