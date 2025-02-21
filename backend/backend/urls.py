from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, get_user_data, get_all_users, CustomTokenObtainPairView, DeactivateUser, ActivateUser
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', CreateUserView.as_view(), name='register'),
    path('api/token/',CustomTokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/',TokenRefreshView.as_view(),name='refresh'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/user/', get_user_data, name='get_user_data'),
    path('api/all-users/', get_all_users, name='get_all_users'),
   path("api/users/<int:user_id>/delete", DeactivateUser, name="delete_user"),
   path("api/users/<int:user_id>/activate", ActivateUser, name="activate_user"),
    path('api/',include('api.urls')),
]
