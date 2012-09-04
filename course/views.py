# Copyright 2012, Cercle Informatique. All rights reserved.

from djangbone.views import BackboneAPIView
from course.models import Course, CourseInfo
from course.forms import EditWikiForm


class CourseBone(BackboneAPIView):
    base_queryset = Course.objects.all()
    serialize_fields = ('id', 'slug', 'name', 'description', 'infos')


class WikiBone(BackboneAPIView):
    base_queryset = CourseInfo.objects.all()
    serialize_fields = ('id', 'user', 'infos', 'date', 'prev')
    edit_form_class = EditWikiForm
