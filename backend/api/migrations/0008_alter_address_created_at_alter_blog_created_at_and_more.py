# Generated by Django 5.1.6 on 2025-02-28 07:25

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_alter_address_created_at_alter_blog_created_at_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 28, 12, 55, 56, 463276), editable=False),
        ),
        migrations.AlterField(
            model_name='blog',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 28, 12, 55, 56, 470345), editable=False),
        ),
        migrations.AlterField(
            model_name='blogcategory',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 28, 12, 55, 56, 469029), editable=False),
        ),
        migrations.AlterField(
            model_name='clientcompany',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 28, 12, 55, 56, 467256), editable=False),
        ),
        migrations.AlterField(
            model_name='contactform',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 28, 12, 55, 56, 466236), editable=False),
        ),
        migrations.AlterField(
            model_name='news',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 28, 12, 55, 56, 477208), editable=False),
        ),
        migrations.AlterField(
            model_name='newscategory',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 28, 12, 55, 56, 476064), editable=False),
        ),
        migrations.AlterField(
            model_name='productcategory',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 28, 12, 55, 56, 479641), editable=False),
        ),
        migrations.AlterField(
            model_name='products',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 28, 12, 55, 56, 480936), editable=False),
        ),
        migrations.AlterField(
            model_name='service',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 28, 12, 55, 56, 484418), editable=False),
        ),
        migrations.AlterField(
            model_name='servicecategory',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 28, 12, 55, 56, 483334), editable=False),
        ),
        migrations.AlterField(
            model_name='webinar',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 28, 12, 55, 56, 474600), editable=False),
        ),
        migrations.AlterField(
            model_name='webinarcategory',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 28, 12, 55, 56, 473211), editable=False),
        ),
    ]
