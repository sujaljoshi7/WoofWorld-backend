# Generated by Django 5.1.6 on 2025-03-07 06:12

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_alter_address_created_at_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 7, 11, 42, 37, 353139), editable=False),
        ),
        migrations.AlterField(
            model_name='clientcompany',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 7, 11, 42, 37, 354445), editable=False),
        ),
        migrations.AlterField(
            model_name='contactform',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 7, 11, 42, 37, 354102), editable=False),
        ),
        migrations.AlterField(
            model_name='news',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 7, 11, 42, 37, 356272), editable=False),
        ),
        migrations.AlterField(
            model_name='newscategory',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 7, 11, 42, 37, 355887), editable=False),
        ),
        migrations.AlterField(
            model_name='productcategory',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 7, 11, 42, 37, 357098), editable=False),
        ),
        migrations.AlterField(
            model_name='products',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 7, 11, 42, 37, 357487), editable=False),
        ),
        migrations.AlterField(
            model_name='service',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 7, 11, 42, 37, 358204), editable=False),
        ),
        migrations.AlterField(
            model_name='servicecategory',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 7, 11, 42, 37, 357878), editable=False),
        ),
        migrations.AlterField(
            model_name='webinar',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 7, 11, 42, 37, 355445), editable=False),
        ),
        migrations.AlterField(
            model_name='webinarcategory',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 7, 11, 42, 37, 355031), editable=False),
        ),
    ]
