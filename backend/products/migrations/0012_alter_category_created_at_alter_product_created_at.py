# Generated by Django 5.1.6 on 2025-03-20 06:47

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0011_alter_category_created_at_alter_product_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 20, 12, 17, 50, 903271), editable=False),
        ),
        migrations.AlterField(
            model_name='product',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 20, 12, 17, 50, 903804), editable=False),
        ),
    ]
