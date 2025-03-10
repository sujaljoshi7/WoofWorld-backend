from django.urls import path
from .views import webinar, activate_webinar, deactivate_webinar, get_specific_webinar_data


urlpatterns = [
   path("", webinar, name="save-webinar"),
   path("webinar/<int:id>/", webinar, name="edit-webinar"),
    path("webinar/<int:webinar_id>/activate/", activate_webinar, name="activate_webinar"),
    path("webinar/<int:webinar_id>/deactivate/", deactivate_webinar, name="deactivate_webinar"),
    path("<int:webinar_id>/", get_specific_webinar_data, name="get_specific_webinar_data"),
]
