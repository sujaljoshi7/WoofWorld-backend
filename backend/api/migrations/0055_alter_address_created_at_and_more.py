# Generated by Django 5.1.6 on 2025-04-17 06:24

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0054_alter_address_created_at_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 17, 11, 54, 26, 438415), editable=False),
        ),
        migrations.AlterField(
            model_name='contactform',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 17, 11, 54, 26, 438936), editable=False),
        ),
    ]
