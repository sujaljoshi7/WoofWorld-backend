# Generated by Django 5.1.6 on 2025-04-17 07:07

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('companydetails', '0063_alter_clientcompany_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clientcompany',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 17, 12, 37, 47, 940865), editable=False),
        ),
    ]
