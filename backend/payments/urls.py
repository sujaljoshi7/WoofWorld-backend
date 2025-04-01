from django.urls import path
from .views import create_order


urlpatterns = [
   path("order/", create_order, name="create-order"),
]
