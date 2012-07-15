# Copyright 2012, RespLab. All rights reserved.

from django.conf.urls.defaults import patterns, url
from config.authentification import stop_anon
from course.views import course_bone, wiki_bone

urlpatterns = patterns('',
    url(r'^(?P<id>\d+)$', 
        stop_anon(course_bone.as_view()), 
        name="course_bone_id"),

    url(r'^wiki/(?P<id>\d+)$', 
        stop_anon(wiki_bone.as_view()), 
        name="wiki_bone_id"),
)
