# Copyright 2012, RespLab. All rights reserved.

from django.db.models.signals import post_save, post_syncdb
from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):
    user = models.OneToOneField(User)
    registration = models.CharField(max_length=80)
    welcome = models.BooleanField(default=True)
    comment = models.TextField(null=True)
    photo = models.CharField(max_length=80, null=True)

    def real_name(self):
        return self.user.first_name + " " + self.user.last_name

class Inscription(models.Model):
    user = models.ForeignKey(User)
    section = models.CharField(max_length=80, null=True)
    year = models.PositiveIntegerField(null=True)

    class Meta:
        unique_together = ('user', 'section', 'year')

# for all user creation, create profile with default value
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance, registration=0)

post_save.connect(create_user_profile, sender=User)

# hack to prevent ./manage syncdb to ask for a superusers
from django.contrib.auth.management import create_superuser
from django.contrib.auth import models as auth_app
post_syncdb.disconnect(create_superuser, sender=auth_app,
                       dispatch_uid="django.contrib.auth.management.create_superuser")
