# Copyright 2012, Cercle Informatique. All rights reserved.

from message.models import Thread, Message
from django.contrib.contenttypes.models import ContentType
from djangbone.views import BackboneAPIView

from message.forms import NewMessageForm, NewCourseThreadForm
from config.utils import get_context
from profile.models import Profile


class ThreadBone(BackboneAPIView):
    base_queryset = Thread.objects.all()
    serialize_fields = ('id', 'subject', 'user', 'refer_oid', 'refer_content', 'message')
    add_form_class = NewCourseThreadForm


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
        output = []
        for thread in queryset.values(*self.serialize_fields):
            messages_queryset = Message.objects.filter(thread=thread["id"])
            messages_dict = dict(((x["id"], x) for x in messages_queryset.values()))
            for message in messages_queryset:
                messages_dict[message.id]["user"] = Profile.objects.filter(id=message.user.id).values()[0]
            thread["messages"] = sorted(messages_dict.values(), key=lambda x: x["id"])
            thread["user"] = Profile.objects.filter(id=queryset[0].user.id).values()[0]
            output.append(thread)
        json_output = self.json_encoder.encode(output)
        return json_output


class MessageBone(BackboneAPIView):
    base_queryset = Message.objects.order_by('-created')
    serialize_fields = ('id', 'user', 'thread', 'text', 'reference')
    add_form_class = NewMessageForm
