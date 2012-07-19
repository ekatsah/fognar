# Copyright 2012, Cercle Informatique. All rights reserved.

from config.json import json_send
from djangbone.views import BackboneAPIView
from django.shortcuts import get_object_or_404
from course.models import Course, CourseInfo
from course.forms import EditWikiForm
from json import loads, dumps

class course_bone(BackboneAPIView):
    base_queryset = Course.objects.all()
    serialize_fields = ('id', 'slug', 'name', 'description', 'infos')

class wiki_bone(BackboneAPIView):
    base_queryset = CourseInfo.objects.all()
    serialize_fields = ('id', 'user', 'infos', 'date', 'prev')
    edit_form_class = EditWikiForm
