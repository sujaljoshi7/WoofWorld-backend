from django.db import models
from django.utils.timezone import now
from datetime import timedelta
import random

def get_expiry_time():
    return now() + timedelta(minutes=5)  # OTP expires in 5 minutes

class OTPModel(models.Model):
    email = models.EmailField(unique=True)
    otp = models.CharField(max_length=6)
    verified = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=get_expiry_time)  # Use function instead of lambda

    def is_valid(self):
        return now() < self.expires_at

    def is_expired(self):
        """Alternative method to check if OTP is expired"""
        return now() > self.expires_at

    @staticmethod
    def generate_otp():
        return str(random.randint(100000, 999999))  # Generates a 6-digit OTP
