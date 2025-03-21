from django.urls import path
from .views import Navbar, get_specific_navbar_item

urlpatterns = [
    # Partner Company
    path("", Navbar.as_view(), name="save-Navbar"),
    path("navbar/<int:id>/", Navbar.as_view(), name="update-single-Navbar-item"),
    path("<int:navbaritem_id>/", get_specific_navbar_item, name="get-single-Navbar-item"),
]
