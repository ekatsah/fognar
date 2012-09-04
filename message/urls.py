# Copyright 2012, Cercle Informatique. All rights reserved.

from django.conf.urls.defaults import patterns, url
from config.authentification import stop_anon
from message.views import thread_bone, thread_typeid, message_bone


urlpatterns = patterns('',
    url(r'^t/$',
        stop_anon(thread_bone.as_view()),
        name="thread_bone"),

    url(r'^t/(?P<id>\d+)$',
        stop_anon(thread_bone.as_view()),
        name="thread_bone_id"),

    url(r'^r/(?P<type>course|group)/(?P<xid>\d+)$',
        stop_anon(thread_typeid.as_view()),
        name="thread_bone_type_id"),

    url(r'^m/(?P<tid>\d+)/$',
        stop_anon(message_bone.as_view()),
        name="message_bone"),

    url(r'^m/(?P<tid>\d+)/(?P<id>\d+)/$',
        stop_anon(message_bone.as_view()),
        name="message_bone_id"),
)
