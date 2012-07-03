# Copyright 2012, RespLab. All rights reserved.

from django.contrib.auth.models import User
from django.db import models

class AppUsing(models.Model):
    user = models.ForeignKey(User)
    name = models.CharField(max_length=80)
    last_visit = models.DateTimeField(auto_now_add=True)
    visited = models.IntegerField(default=0)
    config = models.TextField(null=True)

    class Meta:
        unique_together = ('user', 'name')
