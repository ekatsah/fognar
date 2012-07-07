# Copyright 2012, Cercle Informatique. All rights reserved.

from config.json import json_send
from django.utils.html import escape
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from djangbone.views import BackboneAPIView
from course.models import Course
from re import match

class course_bone(BackboneAPIView):
    base_queryset = Course.objects.all()
    serialize_fields = ('id', 'slug', 'name', 'description')
    
    def dispatch(self, request, *args, **kwargs):
        try:
            c = Course.objects.get(slug = kwargs['slug']);
            self.base_queryset = course_bone.base_queryset.filter(id = c.id);
        except ObjectDoesNotExist:
            self.base_queryset = course_bone.base_queryset.none();
                
        return super(course_bone, self).dispatch(request,*args, **kwargs)