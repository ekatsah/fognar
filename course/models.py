# Copyright 2012, RespLab. All rights reserved.

from django.db import models

class Course(models.Model):
    slug = models.SlugField()
    name = models.CharField(max_length=100)
    description = models.TextField(null=True)

class CourseURL(models.Model):
    course = models.ForeignKey(Course)
    url = models.TextField()
    name = models.TextField()
    click = models.PositiveIntegerField(default=0)
