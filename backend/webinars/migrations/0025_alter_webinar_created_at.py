# Generated by Django 5.1.6 on 2025-03-19 13:30

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webinars', '0024_alter_webinar_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='webinar',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 19, 19, 0, 40, 170607), editable=False),
        ),
    ]
