# Copyright 2012, RespLab. All rights reserved.

from django.conf.urls.defaults import patterns, url
from config.authentification import stop_anon
from views import get_category


urlpatterns = patterns('',
    url(r'^get/(?P<object_id>[^/]+)$', stop_anon(get_category),
        name='category_get'),
)
