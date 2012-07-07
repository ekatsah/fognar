# Copyright 2012, RespLab. All rights reserved.

from django.conf.urls.defaults import patterns, url
from config.authentification import stop_anon
from course.views import wiki_bone
urlpatterns = patterns('',

    url(r'^wiki/(?P<cid>[0-9]+)', 
        stop_anon(wiki_bone.as_view()), 
        name="wiki_bone_type_slug"),
)
