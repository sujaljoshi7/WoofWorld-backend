# Generated by Django 5.1.6 on 2025-04-01 18:29

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('companydetails', '0017_alter_clientcompany_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clientcompany',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 1, 23, 59, 25, 671019), editable=False),
        ),
    ]
