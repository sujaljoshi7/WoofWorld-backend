from django.urls import path
from .views import OrderCheckoutView, AllOrdersAdminView


urlpatterns = [
    path("", OrderCheckoutView.as_view(), name="save-order"),
    path("all/", AllOrdersAdminView.as_view(), name="save-order"),
 
]
