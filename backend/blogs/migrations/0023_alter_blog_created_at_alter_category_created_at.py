# Generated by Django 5.1.6 on 2025-04-04 09:19

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blogs', '0022_alter_blog_created_at_alter_category_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blog',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 4, 14, 49, 30, 469072), editable=False),
        ),
        migrations.AlterField(
            model_name='category',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 4, 14, 49, 30, 467778), editable=False),
        ),
    ]
