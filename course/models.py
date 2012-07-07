# Copyright 2012, RespLab. All rights reserved.

from django.db import models
from profile.models import Profile


class Course(models.Model):
    slug = models.SlugField()
    name = models.CharField(max_length=100)
    description = models.TextField(null=True)

class CourseInfo(models.Model):
    course = models.ForeignKey(Course)
    user = models.ForeignKey(Profile)
    infos = models.TextField()
    date = models.DateTimeField(auto_now=True)
    name = models.TextField()
    click = models.PositiveIntegerField(default=0)
