# Copyright 2012, UrLab. All rights reserved.

from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User)
    name = models.CharField(max_length=80)
    email = models.CharField(max_length=250)
    registration = models.CharField(max_length=80)
    welcome = models.BooleanField(default=True)
    comment = models.TextField(null=True)
    photo = models.CharField(max_length=80, null=True)
    autostart = models.TextField(default="{navbar: {},}")

    _public_fields = ['id', 'user.id', 'name', 'photo']
    _private_fields = ['id', 'user.id', 'name', 'email', 'registration',
                       'welcome', 'photo', 'autostart']
