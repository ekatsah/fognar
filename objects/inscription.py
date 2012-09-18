# Copyright 2012, UrLab. All rights reserved.

from django.db import models
from profile import Profile

class Inscription(models.Model):
    user = models.ForeignKey(Profile)
    section = models.CharField(max_length=80, null=True)
    year = models.PositiveIntegerField(null=True)

    class Meta:
        unique_together = ('user', 'section', 'year')

    _public_fields = []
