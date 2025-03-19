from django.urls import path
from .views import breed,dogs, activate_breed, deactivate_breed, activate_dog, deactivate_dog, get_specific_dog_data


urlpatterns = [
   path("breed/", breed, name="save-breed"),
   path("", dogs, name="save-dog"),
   path("adoption/<int:id>/", dogs, name="edit-dog"),
    path("dog/<int:dog_id>/activate/", activate_dog, name="activate_dog"),
    path("dog/<int:dog_id>/deactivate/", deactivate_dog, name="deactivate_dog"),
    path("<int:dog_id>/", get_specific_dog_data, name="get_specific_dog_data"),
    path("breed/<int:breed_id>/activate/", deactivate_breed, name="deactivate_breed"),
    path("breed/<int:breed_id>/deactivate/", deactivate_breed, name="deactivate_breed"),
]
