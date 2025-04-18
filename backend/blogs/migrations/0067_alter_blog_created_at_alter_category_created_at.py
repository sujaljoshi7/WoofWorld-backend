# Generated by Django 5.1.6 on 2025-04-18 11:08

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blogs', '0066_alter_blog_created_at_alter_category_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blog',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 18, 16, 38, 8, 637356), editable=False),
        ),
        migrations.AlterField(
            model_name='category',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 18, 16, 38, 8, 636723), editable=False),
        ),
    ]
