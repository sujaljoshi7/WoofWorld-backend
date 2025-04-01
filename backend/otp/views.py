from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .utils import generate_otp, send_otp_email
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import OTPVerifySerializer
from . models import OTPModel
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User


@csrf_exempt
def send_otp(request):
    if request.method == "POST":
        try:
            print("Raw Request Body:", request.body)  # Debugging line

            data = json.loads(request.body.decode("utf-8"))  # Ensure decoding
            email = data.get("email")

            if not email:
                return JsonResponse({"error": "Email is required"}, status=400)

            otp = generate_otp()
            if send_otp_email(email, otp):
                return JsonResponse({"message": "OTP sent successfully"}, status=200)
            else:
                return JsonResponse({"error": "Failed to send OTP"}, status=500)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@permission_classes([AllowAny])
@api_view(["POST"])
def verify_otp(request):
    email = request.data.get("email")
    otp = request.data.get("otp")

    if not email or not otp:
        return Response({"error": "Email and OTP are required"}, status=400)

    otp_instance = OTPModel.objects.filter(email=email, otp=otp).first()

    if not otp_instance:
        return Response({"error": "Invalid OTP"}, status=400)

    if otp_instance.is_expired():  # Use new method
        return Response({"error": "OTP has expired"}, status=400)

    # If OTP is valid, delete it from the database (optional)
    otp_instance.delete()

    return Response({"message": "OTP Verified Successfully!"}, status=200)