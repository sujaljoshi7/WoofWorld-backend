# Generated by Django 5.1.6 on 2025-04-04 05:25

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('companydetails', '0021_alter_clientcompany_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clientcompany',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 4, 10, 55, 9, 995999), editable=False),
        ),
    ]
