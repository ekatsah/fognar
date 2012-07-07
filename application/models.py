# Copyright 2012, Cercle Informatique. All rights reserved.

from profile.models import Profile
from django.db import models

class AppUsing(models.Model):
    user = models.ForeignKey(Profile)
    name = models.CharField(max_length=80)
    last_visit = models.DateTimeField(auto_now_add=True)
    visited = models.IntegerField(default=0)
    config = models.TextField(null=True)
