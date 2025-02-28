from django.urls import path
from .views import event_category,event, activate_category, deactivate_category, activate_event, deactivate_event


urlpatterns = [
   path("category/", event_category, name="save-event-category"),
   path("event/", event, name="save-event"),
    path("event/<int:event_id>/activate/", activate_event, name="activate_category"),
    path("event/<int:event_id>/deactivate/", deactivate_event, name="deactivate_category"),
    path("category/<int:category_id>/activate/", activate_category, name="activate_category"),
    path("category/<int:category_id>/deactivate/", deactivate_category, name="deactivate_category"),
]
