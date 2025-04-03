from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Breed, Dogs
from .serializers import BreedSerializer, DogsSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView


class BreedView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        breeds = Breed.objects.all()
        serializer = BreedSerializer(breeds, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = BreedSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DogsView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        dogs = Dogs.objects.select_related("created_by").all()
        serializer = DogsSerializer(dogs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data.copy()
        data['created_by'] = request.user.id
        serializer = DogsSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, **kwargs):
        id = kwargs.get("id")
        data = request.data.copy()
        data['created_by'] = request.user.id
        try:
            dogs = Dogs.objects.get(id=id)
        except Dogs.DoesNotExist:
            return Response({"error": "Dog not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = DogsSerializer(dogs, data=request.data, partial=True)  # Use partial=True for PATCH
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def activate_breed(request, breed_id):
    try:
        breed = Breed.objects.get(id=breed_id)
        breed.status = True
        breed.save(update_fields=["status"])
        return Response({"message": "Breed activated successfully!"}, status=status.HTTP_200_OK)
    except Breed.DoesNotExist:
        return Response({"error": "Breed not found!"}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def deactivate_breed(request, breed_id):
    try:
        breed = Breed.objects.get(id=breed_id)
        breed.status = False
        breed.save(update_fields=["status"])
        return Response({"message": "Breed deactivated successfully!"}, status=status.HTTP_200_OK)
    except Breed.DoesNotExist:
        return Response({"error": "Breed not found!"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def activate_dog(request, dog_id):
    try:
        dogs = Dogs.objects.get(id=dog_id)
        dogs.status = True
        dogs.save(update_fields=["status"])
        return Response({"message": "Dog activated successfully!"}, status=status.HTTP_200_OK)
    except Dogs.DoesNotExist:
        return Response({"error": "Dog not found!"}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def deactivate_dog(request, dog_id):
    try:
        dogs = Dogs.objects.get(id=dog_id)
        dogs.status = False
        dogs.save(update_fields=["status"])
        return Response({"message": "Dog deactivated successfully!"}, status=status.HTTP_200_OK)
    except Dogs.DoesNotExist:
        return Response({"error": "Dog not found!"}, status=status.HTTP_404_NOT_FOUND)
    
class GetSpecificDogData(APIView):
    def get(self,request, dog_id):
        dogs = get_object_or_404(Dogs.objects.select_related("breed"), id=dog_id)
        serializer = DogsSerializer(dogs)  # Use your serializer directly
        return Response(serializer.data, status=status.HTTP_200_OK)