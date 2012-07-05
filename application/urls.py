# Copyright 2012, RespLab. All rights reserved.

from django.conf.urls.defaults import patterns, url
from config.authentification import stop_anon
from application.views import my_apps, get_config

urlpatterns = patterns('',
    url(r'^me$', stop_anon(my_apps), name='application_me'),
    url(r'^get/(?P<app_id>\d+)/$', stop_anon(get_config), name="get_config"),
)
