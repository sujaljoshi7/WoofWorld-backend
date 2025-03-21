# Generated by Django 5.1.6 on 2025-03-20 10:59

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blogs', '0035_alter_blog_created_at_alter_category_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blog',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 20, 16, 29, 10, 103437), editable=False),
        ),
        migrations.AlterField(
            model_name='category',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 20, 16, 29, 10, 102956), editable=False),
        ),
    ]
