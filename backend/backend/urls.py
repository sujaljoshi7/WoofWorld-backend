from django.contrib import admin
from django.urls import path, include
from user.views import get_user_data, get_all_users, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/',CustomTokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/',TokenRefreshView.as_view(),name='refresh'),


    

    path('api/',include('api.urls')),
    path('api-auth/', include('rest_framework.urls')),
   path("api/user/", include('user.urls')),
   path("api/events/", include('events.urls')),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
