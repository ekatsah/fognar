# Copyright 2012, RespLab. All rights reserved.

from django.contrib.contenttypes.generic import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True)
    holds = models.ManyToManyField("self", symmetrical=False)


class CategoryItem(models.Model):
    category = models.ForeignKey(Category)
    object_id = models.PositiveIntegerField()
    object_content = models.ForeignKey(ContentType)
    thing = GenericForeignKey('object_content', 'object_id')
    priority = models.PositiveIntegerField()
