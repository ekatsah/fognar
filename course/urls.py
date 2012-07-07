# Copyright 2012, RespLab. All rights reserved.

from django.conf.urls.defaults import patterns, url
from config.authentification import stop_anon

urlpatterns = patterns('',
    url(r'^', stop_anon(None), 
        name='course_bone'),
)
