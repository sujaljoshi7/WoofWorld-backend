from django.urls import path
from .views import OrderCheckoutView, AllOrdersAdminView, OrderDetailsView, DashboardStatsView


urlpatterns = [
    path("checkout/", OrderCheckoutView.as_view(), name="order-checkout"),
    path("all/", AllOrdersAdminView.as_view(), name="all-orders"),
    path("<int:order_id>/", OrderDetailsView.as_view(), name="order-details"),
    path("dashboard-stats/", DashboardStatsView.as_view(), name="dashboard-stats"),
]
