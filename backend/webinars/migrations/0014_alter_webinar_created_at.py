# Generated by Django 5.1.6 on 2025-04-01 17:57

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webinars', '0013_alter_webinar_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='webinar',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 1, 23, 27, 5, 408251), editable=False),
        ),
    ]
