from django.urls import path
from .views import ProductCategoryView,ProductView, activate_category, deactivate_category, activate_product, deactivate_product, get_specific_product_data


urlpatterns = [
   path("category/", ProductCategoryView.as_view(), name="save-product-category"),
   path("", ProductView.as_view(), name="save-product"),
   path("product/<int:id>/", ProductView.as_view(), name="edit-product"),
    path("product/<int:product_id>/activate/", activate_product, name="activate_product"),
    path("product/<int:product_id>/deactivate/", deactivate_product, name="deactivate_product"),
    path("<int:product_id>/", get_specific_product_data, name="get_specific_product_data"),
    path("category/<int:category_id>/activate/", activate_category, name="activate_category"),
    path("category/<int:category_id>/deactivate/", deactivate_category, name="deactivate_category"),
]
