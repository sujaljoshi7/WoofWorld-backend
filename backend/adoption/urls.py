from django.urls import path
from .views import BreedView,DogsView, activate_breed, deactivate_breed, activate_dog, deactivate_dog, GetSpecificDogData, increment_dog_views


urlpatterns = [
   path("breed/", BreedView.as_view(), name="save-breed"),
   path("", DogsView.as_view(), name="save-dog"),
   path("adoption/<int:id>/", DogsView.as_view(), name="edit-dog"),
    path("dog/<int:dog_id>/activate/", activate_dog, name="activate_dog"),
    path("dog/<int:dog_id>/deactivate/", deactivate_dog, name="deactivate_dog"),
    path("<int:dog_id>/", GetSpecificDogData.as_view(), name="get_specific_dog_data"),
    path("dog/<int:dog_id>/increment-views/", increment_dog_views, name="increment_dog_views"),
    path("breed/<int:breed_id>/activate/", activate_breed, name="activate_breed"),
    path("breed/<int:breed_id>/deactivate/", deactivate_breed, name="deactivate_breed"),
]
