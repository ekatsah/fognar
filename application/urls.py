# Copyright 2012, Cercle Informatique. All rights reserved.

from django.conf.urls.defaults import patterns, url
from config.authentification import stop_anon
from application.views import ConfigView

urlpatterns = patterns('',
    url(r'^config/$',
        stop_anon(ConfigView.as_view()),
        name="app_config"),

    url(r'^config/(?P<id>\d+)',
        stop_anon(ConfigView.as_view()),
        name="app_config_id"),
)
