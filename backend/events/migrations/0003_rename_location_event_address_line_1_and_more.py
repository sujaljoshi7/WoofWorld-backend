# Generated by Django 5.1.6 on 2025-03-29 08:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0002_alter_event_contact_number'),
    ]

    operations = [
        migrations.RenameField(
            model_name='event',
            old_name='location',
            new_name='address_line_1',
        ),
        migrations.AddField(
            model_name='event',
            name='address_line_2',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='event',
            name='maps_link',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
