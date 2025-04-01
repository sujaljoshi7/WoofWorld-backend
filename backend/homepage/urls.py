from django.urls import path
from .views import HeroView, activate_hero, deactivate_hero, get_specific_hero_data, activate_partnercompany, deactivate_partnercompany, get_specific_company_data, PartnerCompanyView


urlpatterns = [
    path("hero/", HeroView.as_view(), name="save-hero"),
    path("hero/<int:id>/", HeroView.as_view(), name="edit-hero"),
    path("hero/<int:hero_id>/activate/", activate_hero, name="activate_hero"),
    path("hero/<int:hero_id>/deactivate/", deactivate_hero, name="deactivate_hero"),
    path("<int:hero_id>/", get_specific_hero_data, name="get_specific_hero_data"),

    # Partner Company
    path("partnercompany/", PartnerCompanyView.as_view(), name="save-partnercompany"),
    path("partnercompany/<int:id>/", PartnerCompanyView.as_view(), name="edit-partnercompany"),
    path("partnercompany/<int:company_id>/activate/", activate_partnercompany, name="activate_partnercompany"),
    path("partnercompany/<int:company_id>/deactivate/", deactivate_partnercompany, name="deactivate_partnercompany"),
    path("getpartnercompany/<int:company_id>/", get_specific_company_data, name="get_specific_company_data"),
]
