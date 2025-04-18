from django.urls import path
from .views import EventCategoryView,EventView, activate_category, deactivate_category, activate_event, deactivate_event, get_specific_event_data,PastEventImageView, GetSpecificPastEventImageView

urlpatterns = [
   path("category/", EventCategoryView.as_view(), name="save-event-category"),
   path("event/", EventView.as_view(), name="save-event"),
   path("event/<int:id>/", EventView.as_view(), name="edit-event"),
    path("event/<int:event_id>/activate/", activate_event, name="activate_category"),
    path("event/<int:event_id>/deactivate/", deactivate_event, name="deactivate_category"),
    path("<int:event_id>/", get_specific_event_data, name="get_specific_event_data"),
    path("category/<int:category_id>/activate/", activate_category, name="activate_category"),
    path("category/<int:category_id>/deactivate/", deactivate_category, name="deactivate_category"),
    path("past-event-images/", PastEventImageView.as_view(), name="PastEventImageView"),
    path("past-event-images/<int:event_id>/", GetSpecificPastEventImageView.as_view(), name="GetSpecificPastEventImageView"),
]
