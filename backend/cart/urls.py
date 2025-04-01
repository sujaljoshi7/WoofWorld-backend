from django.urls import path
from .views import CartView


urlpatterns = [
   path("", CartView.as_view(), name="save-cart"),
   path("<int:id>/", CartView.as_view(), name="save-cart"),
]
