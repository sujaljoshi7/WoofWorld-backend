# Generated by Django 5.1.6 on 2025-04-10 09:32

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0026_alter_address_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 10, 15, 2, 0, 886041), editable=False),
        ),
    ]
