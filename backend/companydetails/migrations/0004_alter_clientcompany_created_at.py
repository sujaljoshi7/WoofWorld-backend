# Generated by Django 5.1.6 on 2025-03-29 08:49

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('companydetails', '0003_alter_clientcompany_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clientcompany',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 29, 14, 19, 23, 216729), editable=False),
        ),
    ]
