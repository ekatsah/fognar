# Copyright 2012, RespLab. All rights reserved.

from django.shortcuts import get_object_or_404
from config.json import json_send, json_list, json_object
from course.models import Course, CourseURL

@json_send
def get_course(r, slug):
    course = get_object_or_404(Course, slug=slug)
    res = [ json_object(r, course, ['id', 'name', 
                                          'description', 'slug'])[1:-1],
            '"urls": ' + json_list(r, CourseURL.objects.filter(course=course),
                                 ['url', 'name', 'click'])]
    return '{' + ', '.join(res) + '}'
