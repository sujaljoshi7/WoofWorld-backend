from django.urls import path
from search.views import GlobalSearchView

urlpatterns = [
    # ... existing urls ...
    path('', GlobalSearchView.as_view(), name='global-search'),
] 