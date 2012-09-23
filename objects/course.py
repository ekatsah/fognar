# Copyright 2012, UrLab. All rights reserved.

from django.db import models

class Course(models.Model):
    slug = models.SlugField()
    name = models.CharField(max_length=100)
    description = models.TextField(null=True)

    _public_fields = ['id', 'slug', 'name', 'description']
