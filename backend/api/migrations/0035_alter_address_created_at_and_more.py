# Generated by Django 5.1.6 on 2025-04-07 08:16

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0034_alter_address_created_at_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 7, 13, 46, 6, 282634), editable=False),
        ),
        migrations.AlterField(
            model_name='contactform',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 7, 13, 46, 6, 284336), editable=False),
        ),
    ]
