from django.db import models
from datetime import datetime
from django.core.exceptions import ValidationError



class ContactDetails(models.Model):
    company_name = models.CharField(max_length=100)
    company_tagline = models.CharField(max_length=100)
    company_description = models.TextField()
    company_address = models.TextField()
    company_contact = models.CharField(max_length=10)
    company_logo = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=6)
    postal_code = models.CharField(max_length=6)
    social_links = models.JSONField()
    office_hours = models.CharField(max_length=50)
    google_map_url = models.CharField(max_length=500)
    established_year = models.CharField(max_length=10)

class ClientCompany(models.Model):
    company_name = models.CharField(max_length=100)
    company_logo = models.CharField(max_length=255)
    status = models.CharField(max_length=2)
    created_at = models.DateTimeField(default=datetime.now(), editable=False)

class AboutUs(models.Model):
    content = models.TextField()