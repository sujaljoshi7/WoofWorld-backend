from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .utils import generate_otp, send_email_to_client
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import OTPVerifySerializer
from .models import OTPModel
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from user.serializers import UserSerializer
from datetime import datetime, timedelta


@api_view(["POST"])
@permission_classes([AllowAny])
def send_otp(request):
    try:
        print("Raw Request Body:", request.body)  # Debugging line

        email = request.data.get("email")

        if not email:
            return Response({"error": "Email is required"}, status=400)

        otp = generate_otp()
        try:
            OTPModel.objects.update_or_create(
                email=email,
                defaults={
                    "otp": otp,
                    "expires_at": datetime.now() + timedelta(minutes=5)
                }
            )
            print(f"OTP stored in database for {email}")
        except Exception as db_error:
            print(f"Database error while storing OTP: {str(db_error)}")
            return Response(
                {"error": "Failed to store OTP", "details": str(db_error)},
                status=500
            )

        try:
            if send_email_to_client(email, otp):
                print(f"OTP email sent successfully to {email}")
                return Response({"message": "OTP sent successfully"}, status=200)
            else:
                print(f"Failed to send OTP email to {email}")
                return Response({"error": "Failed to send OTP email"}, status=500)
        except Exception as email_error:
            print(f"Error sending OTP email: {str(email_error)}")
            return Response(
                {"error": "Failed to send OTP email", "details": str(email_error)},
                status=500
            )
    except Exception as e:
        print(f"Unexpected error in send_otp: {str(e)}")
        return Response(
            {"error": "An unexpected error occurred", "details": str(e)},
            status=500
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def send_registration_otp(request):
    try:
        email = request.data.get("email")
        
        if not email:
            return Response({"error": "Email is required"}, status=400)
        
        print(f"Attempting to send registration OTP to: {email}")
        
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            print(f"Email already registered: {email}")
            return Response({"error": "Email already registered"}, status=400)
        
        # Generate and store OTP
        otp = generate_otp()
        print(f"Generated OTP for {email}: {otp}")
        
        try:
            OTPModel.objects.update_or_create(
                email=email,
                defaults={
                    "otp": otp,
                    "expires_at": datetime.now() + timedelta(minutes=5)
                }
            )
            print(f"OTP stored in database for {email}")
        except Exception as db_error:
            print(f"Database error while storing OTP: {str(db_error)}")
            return Response(
                {"error": "Failed to store OTP", "details": str(db_error)},
                status=500
            )
        
        # Send OTP email
        try:
            if send_email_to_client(email, otp):
                print(f"OTP email sent successfully to {email}")
                return Response({"message": "OTP sent successfully"}, status=200)
            else:
                print(f"Failed to send OTP email to {email}")
                return Response({"error": "Failed to send OTP email"}, status=500)
        except Exception as email_error:
            print(f"Error sending OTP email: {str(email_error)}")
            return Response(
                {"error": "Failed to send OTP email", "details": str(email_error)},
                status=500
            )
    except Exception as e:
        print(f"Unexpected error in send_registration_otp: {str(e)}")
        return Response(
            {"error": "An unexpected error occurred", "details": str(e)},
            status=500
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def verify_otp(request):
    try:
        email = request.data.get("email")
        otp = request.data.get("otp")

        if not email or not otp:
            return Response({"error": "Email and OTP are required"}, status=400)

        # Log the verification attempt
        print(f"Verifying OTP for email: {email}")

        otp_instance = OTPModel.objects.filter(email=email, otp=otp).first()

        if not otp_instance:
            print(f"Invalid OTP for email: {email}")
            return Response({"error": "Invalid OTP"}, status=400)

        if otp_instance.is_expired():
            print(f"Expired OTP for email: {email}")
            return Response({"error": "OTP has expired"}, status=400)

        # If OTP is valid, delete it from the database
        otp_instance.delete()
        print(f"OTP verified successfully for email: {email}")

        return Response({"message": "OTP Verified Successfully!"}, status=200)
    except Exception as e:
        print(f"Error in verify_otp: {str(e)}")
        return Response(
            {"error": "An error occurred during OTP verification", "details": str(e)},
            status=500
        )