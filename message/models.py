# Copyright 2011, Cercle Informatique. All rights reserved.

from django.contrib.contenttypes.generic import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from profile.models import Profile
from django.db import models


CATEGORIES = (
    (u'question cours', u'Question concernant le cours'),
    (u'question exam', u'Question d\'examen'),
    (u'info pratique', u'Info pratique'),
)


class Thread(models.Model):
    subject = models.TextField()
    user = models.ForeignKey(Profile)
    refer_oid = models.PositiveIntegerField()
    refer_content = models.ForeignKey(ContentType)
    referer = GenericForeignKey('refer_content', 'refer_oid')
    created = models.DateTimeField(auto_now_add=True, editable=False)
    category = models.CharField(max_length=15, choices=CATEGORIES)

    def __unicode__(self):
        return u"'%s' by %s on %s" % (self.subject[:50] + u"..." if len(self.subject) > 49 else self.subject, self.user, self.referer)

    class Meta:
        ordering = ['-created']


class Message(models.Model):
    user = models.ForeignKey(Profile)
    thread = models.ForeignKey(Thread)
    text = models.TextField()
    reference = models.ForeignKey("self", null=True, default=None)
    created = models.DateTimeField(auto_now_add=True, editable=False)

    def __unicode__(self):
        return u"'%s' by %s on %s" % (self.text[:50] + u"..." if len(self.text) > 49 else self.text, self.user, self.thread)
