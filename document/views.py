# Copyright 2012, RespLab. All rights reserved.

from config.json import json_send
from django.utils.html import escape
from django.shortcuts import get_object_or_404
from document.models import Document, PendingDocument
from document.forms import UploadHttpForm, UploadFileForm
from permission.models import Permission
from course.models import Course
from group.models import Group
from re import match

def get_context(ctype, context):
    if ctype == 'course':
        return get_object_or_404(Course, slug=context)
    elif ctype == 'group':
        return get_object_or_404(Group, slug=context)
    else:
        # Force 404
        return get_object_or_404(Group, slug="-1")

@json_send
def upload_file(request):
    form = UploadFileForm(request.POST, request.FILES)
    if form.is_valid() and match(r'.*\.[pP][dD][fF]$',
                                 request.FILES['file'].name):
        data = form.cleaned_data
        thing = get_context(data['ctype'], data['context'])
        doc = Document.objects.create(name=escape(data['filename']),
                                      description=escape(data['description']),
                                      uploader=request.user, referer=thing)

        url = '/tmp/TMP402_%d.pdf' % doc.id
        tmp_doc = open(url, 'w')
        tmp_doc.write(request.FILES['file'].read())
        tmp_doc.close()
        Permission.new(request.user, 'document_edit', doc.id)
        PendingDocument.objects.create(doc=doc, state="queued", url='file://' + url)
        return '{"message": "ok"}'
    else:
        return '{"message": "invalid form"}'

@json_send
def upload_http(request):
    form = UploadHttpForm(request.POST)
    if form.is_valid():
        data = form.cleaned_data
        thing = get_context(data['ctype'], data['context'])
        doc = Document.objects.create(name=escape(data['filename']),
                                      description=escape(data['description']),
                                      uploader=request.user, referer=thing)
        Permission.new(request.user, 'document_edit', doc.id)
        PendingDocument.objects.create(doc=doc, state="queued", url=data['url'])
        return '{"message": "ok"}'
    else:
        return '{"message": "invalid form"}'