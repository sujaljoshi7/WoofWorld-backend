from django.urls import path
from .views import ServiceCategory,ServiceView, activate_category, deactivate_category, activate_service, deactivate_service, get_specific_service_data


urlpatterns = [
   path("category/", ServiceCategory.as_view(), name="save-service-category"),
   path("", ServiceView.as_view(), name="save-service"),
   path("service/<int:id>/", ServiceView.as_view(), name="edit-service"),
    path("service/<int:service_id>/activate/", activate_service, name="activate_service"),
    path("service/<int:service_id>/deactivate/", deactivate_service, name="deactivate_service"),
    path("<int:service_id>/", get_specific_service_data, name="get_specific_service_data"),
    path("category/<int:category_id>/activate/", activate_category, name="activate_category"),
    path("category/<int:category_id>/deactivate/", deactivate_category, name="deactivate_category"),
]
