# Copyright 2012, RespLab. All rights reserved.

from django.conf.urls.defaults import patterns, url
from www.authentification import stop_anon
from profile.views import my_profile


urlpatterns = patterns('',
    url(r'^me$',
        stop_anon(my_profile),
        name='profile_me'),
)
