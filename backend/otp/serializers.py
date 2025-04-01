from rest_framework import serializers
from .models import OTPModel

class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, data):
        try:
            otp_record = OTPModel.objects.get(email=data["email"], otp=data["otp"])
            if otp_record.is_expired():
                raise serializers.ValidationError("OTP has expired. Please request a new one.")
        except OTPModel.DoesNotExist:
            raise serializers.ValidationError("Invalid OTP.")
        
        return data
