# Copyright 2012, UrLab. All rights reserved.

from django.conf.urls.defaults import patterns, url
from config.authentification import stop_anon
from restx.views import query

urlpatterns = patterns('',
    url(r'^(?P<model>[^/]+)(/((?P<field>[^:/]*):){0,1}(?P<ids>[^/]+)){0,1}(/)*',
        stop_anon(query),
        name="rest_query"),
)
