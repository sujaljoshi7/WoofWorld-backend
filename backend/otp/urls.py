from django.urls import path
from .views import send_otp, verify_otp, send_registration_otp

urlpatterns = [
    path("send-otp/", send_otp, name="send_otp"),
    path("send-registration-otp/", send_registration_otp, name="send_registration_otp"),
    path("verify-otp/", verify_otp, name="verify-otp"),
]
