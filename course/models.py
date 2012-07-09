# Copyright 2012, RespLab. All rights reserved.

from django.db import models
from profile.models import Profile


class Course(models.Model):
    slug = models.SlugField()
    name = models.CharField(max_length=100)
    description = models.TextField(null=True)
    infos = models.ForeignKey('CourseInfo', null=True)

class CourseInfo(models.Model):
    user = models.ForeignKey(Profile)
    infos = models.TextField()
    date = models.DateTimeField(auto_now=True)
    prev = models.ForeignKey('self', null=True)
