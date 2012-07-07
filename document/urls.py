# Copyright 2012, Cercle Informatique. All rights reserved.

from django.conf.urls.defaults import patterns, url
from config.authentification import stop_anon, uniq_post
from config.json import json_send, json_list
from document.models import Document
from document.views import upload_file, upload_http, document_bone

urlpatterns = patterns('',
    url(r'^d/$', 
        stop_anon(document_bone.as_view()), 
        name="document_bone"),

    url(r'^d/(?P<id>\d+)', 
        stop_anon(document_bone.as_view()), 
        name="document_bone_id"),

    url(r'(?P<type>course|group)/(?P<slug>[A-Za-z0-9-_]+)', 
        document_bone.as_view(), 
        name="document_bone_type_slug"),

    url(r'^upload_file', 
        stop_anon(uniq_post(upload_file)),
        name='document_upload_file'),

    url(r'^upload_http', 
        stop_anon(uniq_post(upload_http)),
        name='document_upload_http'),
)
