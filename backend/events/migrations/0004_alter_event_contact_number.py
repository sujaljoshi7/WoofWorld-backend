# Generated by Django 5.1.6 on 2025-02-28 07:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0003_alter_event_price'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='contact_number',
            field=models.BigIntegerField(),
        ),
    ]
