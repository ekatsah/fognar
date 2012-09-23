# Copyright 2012, UrLab. All rights reserved.

from django.db import models
from profile import Profile
from thread import Thread

class Message(models.Model):
    user = models.ForeignKey(Profile)
    thread = models.ForeignKey(Thread)
    text = models.TextField()
    previous = models.ForeignKey('self', null=True, default=None)
    created = models.DateTimeField(auto_now_add=True, editable=False)

    _public_fields = ['id', 'user.id', 'thread.id', 'text', 'previous.id']
