from django.contrib import admin
from django.urls import path, include
from user.views import  CustomTokenObtainPairView
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
    path("api/blogs/", include('blogs.urls')),
    path("api/adoption/", include('adoption.urls')),
    path("api/services/", include('services.urls')),
    path("api/products/", include('products.urls')),
    path("api/companydetails/", include('companydetails.urls')),
    path("api/homepage/", include('homepage.urls')),
    path("api/navbar/", include('navbar.urls')),
    path("api/otp/", include('otp.urls')),
    path("api/payments/", include('payments.urls')),
    path("api/cart/", include('cart.urls')),
    path("api/order/", include('order.urls')),
    path("api/search/", include('search.urls')),
    path("api/notifications/", include('notifications.urls')),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
