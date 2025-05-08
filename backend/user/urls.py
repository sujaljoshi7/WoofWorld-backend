from django.urls import path, re_path
from .views import get_user_data,get_all_users,get_specific_user_data,CreateUserView, deactivate_user, activate_user, check_email, reset_password, get_logged_in_user_data, AddressView, delete_user, SpecificAddressView

  
urlpatterns = [
    path("<int:user_id>/delete", deactivate_user, name="delete_user"),
    re_path(r"^check-email/(?P<email>[\w.@+-]+)/$", check_email, name="check-email"),
    path("<int:user_id>/activate", activate_user, name="activate_user"),
    path('register/', CreateUserView.as_view(), name='register'),
    path('all-users/', get_all_users, name='get_all_users'),
    path('get-user/<int:user_id>/', get_specific_user_data, name='get_all_users'),
    path('', get_user_data, name='get_user_data'),
    path('loggedin-user/', get_logged_in_user_data, name='get_logged_in_user_data'),
    # path('add-address/', add_address, name='add_address'),
    # path('update-address/<int:address_id>/', update_address, name='update_address'),
    path('address/', AddressView.as_view(), name='user-address'),
    path('address/<int:id>/', SpecificAddressView.as_view(), name='specific-user-address'),
    # path('resend-otp/', CreateUserView.as_view(), name='get_user_data'),
    path('reset-password/', reset_password, name='reset_password'),
    path('<int:user_id>/delete-user/', delete_user, name='delete_user'),
]
