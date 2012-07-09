# Copyright 2012, RespLab. All rights reserved.

from django.conf.urls.defaults import patterns, url
from config.authentification import stop_anon
from course.views import wiki_bone,save_infos

urlpatterns = patterns('',

    url(r'^wiki/(?P<cid>[0-9]+)', 
        stop_anon(wiki_bone.as_view()), 
        name="wiki_bone_type_cid"),
    url(r'^wikisave$', 
        stop_anon(save_infos), 
        name="wiki_info_save"),
)
