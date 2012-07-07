# Copyright 2012, Cercle Informatique. All rights reserved.

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

    # seem to be broken.. FIXME
    @classmethod
    def new(user, name, oid=0):
        if name in PERM_LIST:
            Permission.objects.create(name=name, user=user, object_id=oid)
