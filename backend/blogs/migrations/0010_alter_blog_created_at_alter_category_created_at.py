# Generated by Django 5.1.6 on 2025-03-10 07:09

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blogs', '0009_alter_blog_created_at_alter_category_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blog',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 10, 12, 39, 54, 473459), editable=False),
        ),
        migrations.AlterField(
            model_name='category',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 10, 12, 39, 54, 472617), editable=False),
        ),
    ]
