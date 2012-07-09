# Copyright 2012, Cercle Informatique. All rights reserved.

from config.json import json_send
from django.utils.html import escape
from django.shortcuts import get_object_or_404
from document.models import Document, PendingDocument, Page
from document.forms import UploadHttpForm, UploadFileForm
from djangbone.views import BackboneAPIView
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

class document_bone(BackboneAPIView):
    base_queryset = Document.objects.all()
    serialize_fields = ('id', 'name', 'description', 'uploader', "date", 'rating', 
                        'vote_number', 'view_number', 'download_number')
    
    def dispatch(self, request, *args, **kwargs):
        if kwargs.get('type', None) == 'course':
            try:
                c = Course.objects.get(slug = kwargs['slug']);
                self.base_queryset = document_bone.base_queryset.filter(refer_oid = c.id);
            except:
                self.base_queryset = document_bone.base_queryset.none();
        elif kwargs.get('type', None) == 'group':
            try:
                g = Group.objects.get(slug = kwargs['slug']);
                self.base_queryset = document_bone.base_queryset.filter(refer_oid = g.id);
            except:
                self.base_queryset = document_bone.base_queryset.none();

        return super(document_bone, self).dispatch(request,*args, **kwargs)

class page_bone(BackboneAPIView):
    base_queryset = Page.objects.all()
    serialize_fields = ('id', 'num', 'height_120', 'height_600', 'height_900')
    
    def dispatch(self, request, *args, **kwargs):
        try:
            doc = Document.objects.get(id=kwargs['did'])
            self.base_queryset = page_bone.base_queryset.filter(doc=doc);
        except:
            self.base_queryset = document_bone.base_queryset.none();
        return super(page_bone, self).dispatch(request,*args, **kwargs)

@json_send
def upload_file(request):
    form = UploadFileForm(request.POST, request.FILES)
    if form.is_valid() and match(r'.*\.[pP][dD][fF]$',
                                 request.FILES['file'].name):
        data = form.cleaned_data
        thing = get_context(data['ctype'], data['context'])
        doc = Document.objects.create(name=escape(data['filename']),
                                      description=escape(data['description']),
                                      uploader=request.user.get_profile(),
                                      referer=thing)
        url = '/tmp/TMP402_%d.pdf' % doc.id
        tmp_doc = open(url, 'w')
        tmp_doc.write(request.FILES['file'].read())
        tmp_doc.close()
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
                                      uploader=request.user.get_profile(),
                                      referer=thing)
        PendingDocument.objects.create(doc=doc, state="queued", url=data['url'])
        return '{"message": "ok"}'
    else:
        return '{"message": "invalid form"}'
