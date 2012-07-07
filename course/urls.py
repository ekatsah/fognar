# Copyright 2012, RespLab. All rights reserved.

from django.conf.urls.defaults import patterns, url
from config.authentification import stop_anon
from course.views import course_bone

urlpatterns = patterns('',
    url(r'(?P<slug>[A-Za-z0-9-_]+)', 
        stop_anon(course_bone.as_view()), 
        name="course_bone_slug"),
)
