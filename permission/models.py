# Copyright 2011, hast. All rights reserved.
#
# This program is free software: you can redistribute it and/or modify it
# under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or (at
# your option) any later version.

from django.db import models
from django.contrib.auth.models import User

PERM_LIST = ['document_edit', 'document_manage', 'structure_manage', 
             'user_manage', 'message_edit', 'message_remove']

class Permission(models.Model):
    name = models.CharField(max_length=80)
    user = models.ForeignKey(User, related_name="back_user")
    object_id = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('name', 'user', 'object_id')

    @classmethod
    def new(user, name, oid=0):
        if name in PERM_LIST:
            Permission.objects.create(name=name, user=user, object_id=oid)
