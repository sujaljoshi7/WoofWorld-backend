from django.urls import path
from .views import about_us


urlpatterns = [
   path("aboutus/<int:id>/", about_us, name="save-aboutus"),
]
