from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework import generics, status
from .serializers import UserSerializer, CustomTokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
import random
from django.utils.timezone import now
from datetime import timedelta
from otp.models import OTPModel
from otp.views import send_otp
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
import json
from otp.utils import generate_otp, send_otp_email
from rest_framework_simplejwt.tokens import RefreshToken


def check_email(request, email):
    print("Received email:", email)
    exists = User.objects.filter(email=email).exists()

    if exists:
        return JsonResponse({"message": "Email already exists", "can_register": False}, status=409)
    
    return JsonResponse({"message": "Email is available", "can_register": True}, status=200)

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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_specific_user_data(request, user_id):
    user = get_object_or_404(User, id=user_id)
    data = {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "last_login": user.last_login,
    }
    return Response(data)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        return [AllowAny()]

    def perform_create(self, serializer):
        user = serializer.save()  # Save the user
        otp = str(random.randint(100000, 999999))  # Generate OTP

        # Store OTP in OTPModel
        OTPModel.objects.update_or_create(
            email=user.email,
            defaults={"otp": otp, "expires_at": now() + timedelta(minutes=5)}
        )

        # Get email from self.request.data
        email = self.request.data.get("email")

        if not email:
            raise ValueError("Email is required")

        # Send OTP Email
        if send_otp_email(email, otp):
            print(f"OTP {otp} sent to {email}")
        else:
            print("Failed to send OTP email")

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        print(refresh.access_token)
        return Response(
           {
                "message": "User registered successfully! OTP sent.",
                "access": access_token,
                "refresh": str(refresh),
                "email": user.email,
            },
            status=status.HTTP_201_CREATED
        )




# class create_user_view(generics.CreateAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [AllowAny]

#     @api_view(['POST'])
#     def register_user(request):
#         if request.method == "POST":
#             # Get data from the request
#             first_name = request.data.get('first_name')
#             last_name = request.data.get('last_name')
#             email = request.data.get('email')
#             password = request.data.get('password')
#             otp = OTPModel.generate_otp()
#             try:
#                 # Create a new user
#                 user = User.objects.create_user(username=email,  # Use email as username
#                                                 first_name=first_name,
#                                                 last_name=last_name,
#                                                 email=email,
#                                                 password=password)
#                 user.save()
#                 return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
#             except Exception as e:
#                 return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def deactivate_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.is_active = False  # Set is_active to False (0)
        user.save(update_fields=["is_active"])
        return Response({"message": "User deactivated successfully!"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found!"}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def activate_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.is_active = True  # Set is_active to False (0)
        user.save(update_fields=["is_active"])
        return Response({"message": "User activated successfully!"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found!"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def reset_password(request):
    email = request.data.get('email')
    new_password = request.data.get('password')
    if not email or not new_password:
        return Response({'message': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password reset successfully'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'message': 'Email not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message': 'Something went wrong', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if "access" in response.data:
            print(f"✅ Access Token: {response.data['access']}")
            print(f"✅ Refresh Token: {response.data['refresh']}")
        else:
            print("❌ Tokens not generated!")

        return response
