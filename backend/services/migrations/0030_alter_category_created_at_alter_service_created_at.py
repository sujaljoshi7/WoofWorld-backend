# Generated by Django 5.1.6 on 2025-04-07 08:08

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0029_alter_category_created_at_alter_service_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 7, 13, 38, 27, 20645), editable=False),
        ),
        migrations.AlterField(
            model_name='service',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 7, 13, 38, 27, 21697), editable=False),
        ),
    ]
