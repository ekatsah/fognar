# Copyright 2011, Cercle Informatique. All rights reserved.

from django.contrib.contenttypes.generic import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from profile.models import Profile
from datetime import datetime
from django.db import models


class Thread(models.Model):
    subject = models.TextField();
    user = models.ForeignKey(Profile)
    refer_oid = models.PositiveIntegerField()
    refer_content = models.ForeignKey(ContentType)
    referer = GenericForeignKey('refer_content', 'refer_oid')
    created = models.DateTimeField(auto_now_add=True, editable=False)


class Message(models.Model):
    user = models.ForeignKey(Profile)
    thread = models.ForeignKey(Thread)
    text = models.TextField()
    date = models.DateTimeField(default=datetime.now)
    reference = models.ForeignKey("self", null=True)
    created = models.DateTimeField(auto_now_add=True, editable=False)
