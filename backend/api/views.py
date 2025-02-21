from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from .serializers import UserSerializer, CustomTokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView

def check_email(request, email):
    exists = User.objects.filter(email=email).exists()
    return JsonResponse({"exists": exists})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    user = request.user
    user_data = {
        "id": user.id,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "is_staff": user.is_staff,
    }
    return Response(user_data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_users(request):
    users = User.objects.all().values("id", "username", "email", "first_name", "last_name", "is_staff", "date_joined", "is_active","last_login")
    return Response(list(users))

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    @api_view(['POST'])
    def register_user(request):
        if request.method == "POST":
            # Get data from the request
            first_name = request.data.get('first_name')
            last_name = request.data.get('last_name')
            email = request.data.get('email')
            password = request.data.get('password')
            
            try:
                # Create a new user
                user = User.objects.create_user(username=email,  # Use email as username
                                                first_name=first_name,
                                                last_name=last_name,
                                                email=email,
                                                password=password)
                user.save()
                return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def DeactivateUser(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.is_active = False  # Set is_active to False (0)
        user.save(update_fields=["is_active"])
        return Response({"message": "User deactivated successfully!"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found!"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def ActivateUser(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.is_active = True  # Set is_active to False (0)
        user.save(update_fields=["is_active"])
        return Response({"message": "User activated successfully!"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found!"}, status=status.HTTP_404_NOT_FOUND)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer