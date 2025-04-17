# Generated by Django 5.1.6 on 2025-04-17 07:25

import datetime
import services.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0004_alter_category_created_at_alter_service_created_at_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 17, 12, 55, 23, 541277), editable=False),
        ),
        migrations.AlterField(
            model_name='service',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 17, 12, 55, 23, 541835), editable=False),
        ),
        migrations.AlterField(
            model_name='service',
            name='image',
            field=models.URLField(validators=[services.models.validate_image_size]),
        ),
    ]
