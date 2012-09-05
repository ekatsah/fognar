# Copyright 2012, Cercle Informatique. All rights reserved.

from message.models import Thread, Message
from django.contrib.contenttypes.models import ContentType
from djangbone.views import BackboneAPIView

from message.forms import NewThreadForm
from config.utils import get_context
from profile.models import Profile


class ThreadBone(BackboneAPIView):
    base_queryset = Thread.objects.all()
    serialize_fields = ('id', 'subject', 'user', 'refer_oid', 'refer_content', 'message')
    add_form_class = NewThreadForm


class ThreadBoneTypeId(BackboneAPIView):
    base_queryset = Thread.objects.all()
    serialize_fields = ('id', 'subject', 'user', 'refer_oid', 'refer_content', 'message', 'created')

    def dispatch(self, request, *args, **kwargs):
        thing = get_context(kwargs.get('type', None), kwargs.get('xid', -1))
        c = ContentType.objects.get_for_model(thing)
        qs = ThreadBoneTypeId.base_queryset
        self.base_queryset = qs.filter(refer_oid=thing.id, refer_content=c)
        return super(ThreadBoneTypeId, self).dispatch(request,*args, **kwargs)

    def serialize_qs(self, queryset, single_object=False):
        # for simplicy, I assume that this we will always return only one thread
        value = queryset.values(*self.serialize_fields)[0]
        messages_queryset = Message.objects.filter(thread=queryset[0].id)
        messages_dict = dict(((x["id"], x) for x in messages_queryset.values()))
        for message in messages_queryset:
            messages_dict[message.id]["user"] = Profile.objects.filter(id=message.user.id).values()[0]
        value["messages"] = sorted(messages_dict.values(), key=lambda x: x["id"])
        value["user"] = Profile.objects.filter(id=queryset[0].user.id).values()[0]
        json_output = self.json_encoder.encode(value)
        return json_output


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
