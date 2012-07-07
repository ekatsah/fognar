# Copyright 2012, Cercle Informatique. All rights reserved.

from django.conf.urls.defaults import patterns, url
from config.authentification import stop_anon
from profile.views import profile_bone


urlpatterns = patterns('',
    url(r'^(?P<id>\d+', profile_bone.as_view(), name="profile_bone_id"),
)
