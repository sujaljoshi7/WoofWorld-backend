from django.urls import path
from .views import (
    OrderCheckoutView,
    AllOrdersAdminView,
    OrderDetailsView,
    DashboardStatsView,
    UpdateOrderStatusView
)


urlpatterns = [
    path("", OrderCheckoutView.as_view(), name="order-checkout"),
    path("all/", AllOrdersAdminView.as_view(), name="admin-orders"),
    path("<int:order_id>/", OrderDetailsView.as_view(), name="order-details"),
    path("dashboard-stats/", DashboardStatsView.as_view(), name="dashboard-stats"),
    path("<int:order_id>/update-status/", UpdateOrderStatusView.as_view(), name="update-order-status"),
]
