from django.urls import path
from .views import hero, activate_hero, deactivate_hero, get_specific_hero_data


urlpatterns = [
   path("hero/", hero, name="save-hero"),
   path("hero/<int:id>/", hero, name="edit-hero"),
    path("hero/<int:hero_id>/activate/", activate_hero, name="activate_hero"),
    path("hero/<int:hero_id>/deactivate/", deactivate_hero, name="deactivate_hero"),
    path("<int:hero_id>/", get_specific_hero_data, name="get_specific_hero_data"),
]
