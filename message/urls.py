# Copyright 2012, Cercle Informatique. All rights reserved.

from django.conf.urls.defaults import patterns, url
from config.authentification import stop_anon
from message.views import ThreadBone, ThreadBoneTypeId, MessageBone


urlpatterns = patterns('',
    url(r'^t/$',
        stop_anon(ThreadBone.as_view()),
        name="thread_bone"),

    url(r'^t/(?P<id>\d+)$',
        stop_anon(ThreadBone.as_view()),
        name="thread_bone_id"),

    url(r'^r/(?P<type>course|group)/(?P<xid>\d+)$',
        stop_anon(ThreadBoneTypeId.as_view()),
        name="thread_bone_type_id"),

    url(r'^m/(?P<tid>\d+)/$',
        stop_anon(MessageBone.as_view()),
        name="message_bone"),

    url(r'^m/(?P<tid>\d+)/(?P<id>\d+)/$',
        stop_anon(MessageBone.as_view()),
        name="message_bone_id"),
)
