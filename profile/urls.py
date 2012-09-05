# Copyright 2012, Cercle Informatique. All rights reserved.

from django.conf.urls.defaults import patterns, url
from config.authentification import stop_anon
from profile.views import ProfileBone


urlpatterns = patterns('',
    url(r'^(?P<id>\d+)',
        stop_anon(ProfileBone.as_view()),
        name="profile_bone_id"),
)
