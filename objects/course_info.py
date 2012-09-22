# Copyright 2012, UrLab. All rights reserved.

from django.db import models
from course import Course
from profile import Profile

class CourseInfo(models.Model):
    user = models.ForeignKey(Profile)
    infos = models.TextField()
    date = models.DateTimeField(auto_now=True)
    course = models.ForeignKey(Course)

    _public_fields = ['user.id', 'infos', 'date', 'course.id']
