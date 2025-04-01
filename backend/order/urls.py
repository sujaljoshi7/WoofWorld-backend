from django.urls import path
from .views import OrderCheckoutView


urlpatterns = [
    path("", OrderCheckoutView.as_view(), name="save-order"),
 
]
