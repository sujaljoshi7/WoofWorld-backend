# Generated by Django 5.1.6 on 2025-04-17 05:43

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0037_alter_address_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 17, 11, 11, 39, 13880), editable=False),
        ),
    ]
