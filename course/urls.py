# Copyright 2012, RespLab. All rights reserved.

from django.conf.urls.defaults import patterns, url
from config.authentification import stop_anon
from config.json import json_send, json_list
from course.models import Course
from course.views import get_course

urlpatterns = patterns('',
    url(r'^all$', stop_anon(json_send(json_list)), 
        {'queryset': Course.objects.all,
         'fields': ['id', 'slug', 'name', 'description']},
        name='course_all'),

    url(r'^get/(?P<slug>[^/]+)$', stop_anon(get_course),
        name='course_get'),
)
