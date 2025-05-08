from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework import generics, status
from .serializers import UserSerializer, CustomTokenObtainPairSerializer, AddressSerializer
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
from otp.utils import generate_otp, send_email_to_client
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Address
from rest_framework.views import APIView
from django.contrib.auth.forms import PasswordResetForm
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings


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
        "is_staff": user.is_staff,
    }
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Ensures the user is logged in
def get_logged_in_user_data(request):
    user = request.user  # Get the currently authenticated user

    # Fetch the single address for the user (if exists)
    address = Address.objects.filter(user_id=user).first()  

    # Prepare the address data
    address_data = None
    if address:
        address_data = {
            "name": address.name,
            "address_line_1": address.address_line_1,
            "address_line_2": address.address_line_2,
            "postal_code": address.postal_code,
            "city": address.city,
            "state": address.state,
            "country": address.country,
            "phone": address.phone,
            "created_at": address.created_at,
        }

    data = {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "last_login": user.last_login,
        "member_since": user.date_joined,
        "address": address_data  # Now it's a single object, not a list
    }
    
    return Response(data)

class SpecificAddressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        """Retrieve the user's address."""
        address = get_object_or_404(Address, user=id)
        if address:
            serializer = AddressSerializer(address)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"detail": "No address found"}, status=status.HTTP_404_NOT_FOUND)
    

class AddressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve the user's address."""
        address = Address.objects.filter(user=request.user).first()
        if address:
            serializer = AddressSerializer(address)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"detail": "No address found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        """Create an address only if the user doesn't have one."""
        user = request.user
        if Address.objects.filter(user=user).exists():
            return Response({"detail": "User already has an address. Please update it instead."}, 
                        status=status.HTTP_400_BAD_REQUEST)

        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            # Use user instead of user_id
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Add this to see validation errors
            print("Validation errors:", serializer.errors)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        """Update the existing address if it exists."""
        user = request.user
        
        # Use user instead of user_id
        address = Address.objects.filter(user=user).first()
        
        if not address:
            return Response({"detail": "No address found. Please create one first."}, 
                        status=status.HTTP_404_NOT_FOUND)

        serializer = AddressSerializer(address, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        return [AllowAny()]

    def perform_create(self, serializer):
        # Create the user
        user = serializer.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        
        return Response(
            {
                "message": "User registered successfully!",
                "access": access_token,
                "refresh": str(refresh),
                "email": user.email,
            },
            status=status.HTTP_201_CREATED
        )



            
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

@api_view(['POST'])
def send_password_reset_email(request):
    email = request.data.get('email')

    if not email:
        return Response({'message': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

    if not User.objects.filter(email=email).exists():
        return Response({'message': 'User with this email does not exist'}, status=status.HTTP_404_NOT_FOUND)

    form = PasswordResetForm(data={'email': email})
    if form.is_valid():
        form.save(
            request=request,
            use_https=request.is_secure(),
            email_template_name='registration/password_reset_email.html',
        )
        return Response({'message': 'Password reset email sent'}, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'Invalid email'}, status=status.HTTP_400_BAD_REQUEST)


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

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)

        # Prevent deleting staff/admin accounts
        if user.is_staff:
            return Response({"error": "Cannot delete an admin account."}, status=status.HTTP_403_FORBIDDEN)

        # Optional: Only allow user to delete themselves or allow if staff
        if request.user != user and not request.user.is_staff:
            return Response({"error": "You do not have permission to delete this user."},
                            status=status.HTTP_403_FORBIDDEN)

        user.delete()
        return Response({"message": "User deleted successfully."}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

def send_password_reset_email(email, reset_token):
    """Send password reset email with token"""
    try:
        # Create the context for the email template
        context = {
            'reset_link': f"{settings.FRONTEND_URL}/reset-password/{reset_token}",
            'site_name': 'WoofWorld',
            'valid_hours': 24  # Token validity period
        }

        # Render HTML email template
        html_message = render_to_string('user/password_reset_email.html', context)
        plain_message = strip_tags(html_message)  # Create plain text version

        # Send email
        send_mail(
            subject='Reset Your WoofWorld Password',
            message=plain_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending password reset email: {str(e)}")
        return False

