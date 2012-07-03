# hack to prevent ./manage syncdb to ask for a superusers
from django.db.models.signals import post_syncdb
from django.contrib.auth.management import create_superuser
from django.contrib.auth import models as auth_app


def dont_create_a_superuser():
    post_syncdb.disconnect(create_superuser, sender=auth_app,
                           dispatch_uid="django.contrib.auth.management.create_superuser")
