# Generated by Django 5.1.6 on 2025-04-17 06:26

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0041_alter_address_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 17, 11, 56, 1, 863482), editable=False),
        ),
    ]
