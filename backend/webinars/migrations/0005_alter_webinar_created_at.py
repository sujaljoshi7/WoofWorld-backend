# Generated by Django 5.1.6 on 2025-03-31 06:05

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webinars', '0004_alter_webinar_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='webinar',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 31, 11, 35, 38, 348933), editable=False),
        ),
    ]
