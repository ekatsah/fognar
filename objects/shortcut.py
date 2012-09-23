# Copyright 2012, UrLab. All rights reserved.

from django.db import models
from profile import Profile

class Shortcut(models.Model):
    user = models.ForeignKey(Profile)
    app = models.CharField(max_length=255)
    app_id = models.PositiveIntegerField()
    position = models.PositiveIntegerField()

    class Meta:
        unique_together = ('user', 'position')
        ordering = ['position']

    _public_fields = []
    _private_fields = ['id', 'user.id', 'app', 'app_id', 'position']
