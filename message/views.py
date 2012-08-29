# Copyright 2012, Cercle Informatique. All rights reserved.

from django.shortcuts import get_object_or_404
from message.models import Thread, Message
from django.contrib.contenttypes.models import ContentType
from djangbone.views import BackboneAPIView
from course.models import Course
from group.models import Group

def get_context(ctype, context):
    if ctype == 'course':
        return get_object_or_404(Course, id=context)
    elif ctype == 'group':
        return get_object_or_404(Group, id=context)
    else:
        # Force 404
        return get_object_or_404(Group, id="-1")

from message.forms import NewThreadForm

class thread_bone(BackboneAPIView):
    base_queryset = Thread.objects.all()
    serialize_fields = ('id', 'subject', 'user', 'refer_oid', 'refer_content', 'message_set')
    add_form_class = NewThreadForm

class thread_typeid(BackboneAPIView):
    base_queryset = Thread.objects.all()
    serialize_fields = ('id', 'subject', 'user', 'refer_oid', 'refer_content', 'message_set')

    def dispatch(self, request, *args, **kwargs):
        thing = get_context(kwargs.get('type', None), kwargs.get('xid', -1))
        c = ContentType.objects.get_for_model(thing)
        qs = thread_typeid.base_queryset
        self.base_queryset = qs.filter(refer_oid=thing.id, refer_content=c)
        return super(thread_typeid, self).dispatch(request,*args, **kwargs)


class message_bone(BackboneAPIView):
    base_queryset = Message.objects.order_by('-date')
    serialize_fields = ('id', 'user', 'thread', 'text', 'date')

    def dispatch(self, request, *args, **kwargs):
        try:
            thread = Thread.objects.get(id=kwargs['tid'])
            self.base_queryset = message_bone.base_queryset.filter(thread=thread)
        except:
            self.base_queryset = message_bone.base_queryset.none();
        return super(message_bone, self).dispatch(request,*args, **kwargs)
