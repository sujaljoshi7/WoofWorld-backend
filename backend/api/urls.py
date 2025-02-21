from django.urls import path
from .views import check_email, CreateUserView,DeactivateUser

urlpatterns = [
   path("users/check-email/<str:email>/", check_email, name="check-email"),
]
