from django.urls import path
from .views import OrderCheckoutView, AllOrdersAdminView, OrderDetailsView


urlpatterns = [
    path("", OrderCheckoutView.as_view(), name="save-order"),
    path("all/", AllOrdersAdminView.as_view(), name="save-order"),
    path("<int:order_id>/", OrderDetailsView.as_view(), name="order-details"),
]
