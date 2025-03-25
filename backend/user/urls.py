from django.urls import path, re_path
from .views import get_user_data,get_all_users,get_specific_user_data,create_user_view, deactivate_user, activate_user, check_email, reset_password

  
urlpatterns = [
    path("<int:user_id>/delete", deactivate_user, name="delete_user"),
    re_path(r"^check-email/(?P<email>[\w.@+-]+)/$", check_email, name="check-email"),
    path("<int:user_id>/activate", activate_user, name="activate_user"),
    path('register/', create_user_view.as_view(), name='register'),
    path('all-users/', get_all_users, name='get_all_users'),
    path('get-user/<int:user_id>/', get_specific_user_data, name='get_all_users'),
    path('', get_user_data, name='get_user_data'),
    path('reset-password/', reset_password, name='reset_password'),
]
