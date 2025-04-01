from django.urls import path
from .views import BlogCategoryView,BlogView, activate_category, deactivate_category, activate_blog, deactivate_blog, GetSpecificBlogData


urlpatterns = [
   path("category/", BlogCategoryView.as_view(), name="save-blog-category"),
   path("", BlogView.as_view(), name="save-blog"),
   path("blog/<int:id>/", BlogView.as_view(), name="edit-blog"),
    path("blog/<int:blog_id>/activate/", activate_blog, name="activate_blog"),
    path("blog/<int:blog_id>/deactivate/", deactivate_blog, name="deactivate_blog"),
    path("<int:blog_id>/", GetSpecificBlogData.as_view(), name="get_specific_blog_data"),
    path("category/<int:category_id>/activate/", activate_category, name="activate_category"),
    path("category/<int:category_id>/deactivate/", deactivate_category, name="deactivate_category"),
]
