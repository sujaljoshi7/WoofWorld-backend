# Generated by Django 5.1.6 on 2025-04-11 15:44

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0010_alter_category_created_at_alter_product_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 11, 21, 14, 43, 411331), editable=False),
        ),
        migrations.AlterField(
            model_name='product',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 11, 21, 14, 43, 411871), editable=False),
        ),
    ]
