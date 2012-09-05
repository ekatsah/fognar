# Copyright 2012, Cercle Informatique. All rights reserved.

from message.models import Thread, Message
from django.contrib.contenttypes.models import ContentType
from djangbone.views import BackboneAPIView

from message.forms import NewThreadForm
from config.utils import get_context


class ThreadBone(BackboneAPIView):
    base_queryset = Thread.objects.all()
    serialize_fields = ('id', 'subject', 'user', 'refer_oid', 'refer_content', 'message')
    add_form_class = NewThreadForm


class ThreadBoneTypeId(BackboneAPIView):
    base_queryset = Thread.objects.all()
    serialize_fields = ('id', 'subject', 'user', 'refer_oid', 'refer_content', 'message')

    def dispatch(self, request, *args, **kwargs):
        thing = get_context(kwargs.get('type', None), kwargs.get('xid', -1))
        c = ContentType.objects.get_for_model(thing)
        qs = ThreadBoneTypeId.base_queryset
        self.base_queryset = qs.filter(refer_oid=thing.id, refer_content=c)
        return super(ThreadBoneTypeId, self).dispatch(request,*args, **kwargs)


class MessageBone(BackboneAPIView):
    base_queryset = Message.objects.order_by('-date')
    serialize_fields = ('id', 'user', 'thread', 'text', 'date')

    def dispatch(self, request, *args, **kwargs):
        try:
            thread = Thread.objects.get(id=kwargs['tid'])
            self.base_queryset = MessageBone.base_queryset.filter(thread=thread)
        except:
            self.base_queryset = MessageBone.base_queryset.none();
        return super(MessageBone, self).dispatch(request,*args, **kwargs)
