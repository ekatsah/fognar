# Copyright 2012, Cercle Informatique. All rights reserved.

from django.conf.urls.defaults import patterns, url
from config.authentification import stop_anon, uniq_post
from document.views import upload_file, upload_http, document_bone
from document.views import rate, document_typeid, page_bone

urlpatterns = patterns('',
    url(r'^d/$', 
        stop_anon(document_bone.as_view()), 
        name="document_bone"),

    url(r'^d/(?P<id>\d+)', 
        stop_anon(document_bone.as_view()), 
        name="document_bone_id"),

    url(r'^r/(?P<type>course|group)/(?P<cid>\d+)', 
        stop_anon(document_typeid.as_view()), 
        name="document_bone_type_id"),

    url(r'^p/(?P<did>\d+)/',
        stop_anon(page_bone.as_view()),
        name="document_page"),

    url(r'^upload_file', 
        stop_anon(uniq_post(upload_file)),
        name='document_upload_file'),

    url(r'^upload_http', 
        stop_anon(uniq_post(upload_http)),
        name='document_upload_http'),

    url(r'^rate/(?P<did>\d+)',
        stop_anon(uniq_post(rate)),
        name = 'document_rate'),
)
