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
    autostart = models.TextField(default="{sidebar: {}, navbar: {},}")

    _public_fields = ['user', 'name', 'photo']
