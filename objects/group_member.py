# Copyright 2012, UrLab. All rights reserved.

from django.db import models
from group import Group
from profile import Profile

class GroupMember(models.Model):
    user = models.ForeignKey(Profile)
    group = models.ForeignKey(Group)
    title = models.TextField()
    role = models.TextField()

    _public_fields = ['user', 'group', 'title', 'role']
