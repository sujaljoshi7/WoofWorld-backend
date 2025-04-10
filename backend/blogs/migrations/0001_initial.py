# Generated by Django 5.1.6 on 2025-03-24 16:46

import blogs.models
import datetime
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Blog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='', max_length=100)),
                ('content', models.TextField()),
                ('image', models.ImageField(default='', upload_to='blogs/', validators=[blogs.models.validate_image_size])),
                ('status', models.IntegerField()),
                ('created_at', models.DateTimeField(default=datetime.datetime(2025, 3, 24, 22, 16, 15, 811133), editable=False)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='blog_author', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('status', models.CharField(max_length=2)),
                ('created_at', models.DateTimeField(default=datetime.datetime(2025, 3, 24, 22, 16, 15, 810649), editable=False)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='blog_cat_user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment', models.CharField(max_length=100)),
                ('status', models.CharField(max_length=2)),
                ('blog_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='blogcomment', to='blogs.blog')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='blogusercomment', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
