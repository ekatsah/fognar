# Copyright 2012, UrLab. All rights reserved.

from django.conf.urls.defaults import patterns, url
from config.authentification import stop_anon
from rest.views import query, refered_query

urlpatterns = patterns('',
    url(r'^refered/(?P<model>\w+)/(?P<content>\w+)/(?P<rid>\d+)',
        stop_anon(refered_query),
        name="rest_refered_query"),

    url(r'^(?P<model>[^/]+)(/((?P<field>[^:/]*):){0,1}(?P<ids>[^/]+)){0,1}(/)*',
        stop_anon(query),
        name="rest_query"),
)
