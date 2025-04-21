from django.urls import path
from .views import Notification
urlpatterns = [
   path("", Notification.as_view(), name="Notification"),
]