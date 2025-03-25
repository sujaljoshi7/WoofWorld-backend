# Generated by Django 5.1.6 on 2025-03-24 16:46

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AboutUs',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='ClientCompany',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_name', models.CharField(max_length=100)),
                ('company_logo', models.CharField(max_length=255)),
                ('status', models.CharField(max_length=2)),
                ('created_at', models.DateTimeField(default=datetime.datetime(2025, 3, 24, 22, 16, 15, 822759), editable=False)),
            ],
        ),
        migrations.CreateModel(
            name='ContactDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_name', models.CharField(max_length=100)),
                ('company_tagline', models.CharField(max_length=100)),
                ('company_description', models.TextField()),
                ('company_address', models.TextField()),
                ('company_contact', models.CharField(max_length=10)),
                ('company_logo', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=100)),
                ('state', models.CharField(max_length=100)),
                ('postal_code', models.CharField(max_length=6)),
                ('social_links', models.JSONField()),
                ('office_hours', models.CharField(max_length=50)),
                ('google_map_url', models.CharField(max_length=500)),
                ('established_year', models.CharField(max_length=10)),
            ],
        ),
    ]
