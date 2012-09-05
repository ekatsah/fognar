# Copyright 2012, RespLab. All rights reserved.

from django.conf.urls.defaults import patterns, url
from config.authentification import stop_anon
from course.views import CourseBone, WikiBone

urlpatterns = patterns('',
    url(r'^$',
        stop_anon(CourseBone.as_view()),
        name="course_bone"),

    url(r'^(?P<id>\d+)$',
        stop_anon(CourseBone.as_view()),
        name="course_bone_id"),

    url(r'^wiki/(?P<id>\d+)$',
        stop_anon(WikiBone.as_view()),
        name="wiki_bone_id"),
)
