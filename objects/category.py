# Copyright 2012, UrLab. All rights reserved.

from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True)
    parent = models.ForeignKey('self', null=True)

    _public_fields = ['id', 'name', 'description', 'parent.id']
