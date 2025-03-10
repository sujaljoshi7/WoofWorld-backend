from django.urls import path
from .views import blog_category,blog, activate_category, deactivate_category, activate_blog, deactivate_blog, get_specific_blog_data


urlpatterns = [
   path("category/", blog_category, name="save-blog-category"),
   path("", blog, name="save-blog"),
   path("blog/<int:id>/", blog, name="edit-blog"),
    path("blog/<int:blog_id>/activate/", activate_blog, name="activate_blog"),
    path("blog/<int:blog_id>/deactivate/", deactivate_blog, name="deactivate_blog"),
    path("<int:blog_id>/", get_specific_blog_data, name="get_specific_blog_data"),
    path("category/<int:category_id>/activate/", activate_category, name="activate_category"),
    path("category/<int:category_id>/deactivate/", deactivate_category, name="deactivate_category"),
]
