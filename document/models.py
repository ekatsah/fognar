# Copyright 2012, Cercle Informatique. All rights reserved.

from django.contrib.contenttypes.generic import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from profile.models import Profile
from django.db import models
from re import sub
from math import sqrt
from document.stat import getT


class Document(models.Model):
    name = models.TextField()
    description = models.TextField()
    uploader = models.ForeignKey(Profile)
    # a course, a discussion, a group whatever
    refer_oid = models.PositiveIntegerField()
    refer_content = models.ForeignKey(ContentType)
    referer = GenericForeignKey('refer_content', 'refer_oid')

    size = models.PositiveIntegerField(null=True, default=0)
    words = models.PositiveIntegerField(null=True, default=0)
    pages = models.PositiveIntegerField(null=True, default=0)
    date = models.DateTimeField(auto_now=False, null=False)

    rating_1 = models.PositiveIntegerField(null=True, default=0)
    rating_2 = models.PositiveIntegerField(null=True, default=0)
    rating_3 = models.PositiveIntegerField(null=True, default=0)
    rating_4 = models.PositiveIntegerField(null=True, default=0)
    rating_5 = models.PositiveIntegerField(null=True, default=0)
    rating_average = models.FloatField(null=True, default=0)
    rating_lower_bound = models.FloatField(null=True, default=0)
    rating_number = models.PositiveIntegerField(null=True, default=0)
    view_number = models.PositiveIntegerField(null=True, default=0)
    download_number = models.PositiveIntegerField(null=True, default=0)

    def pretty_name(self):
        name = sub(r'[^-_a-z]', '', self.name.lower().replace(' ', '_'))
        if not name.endswith('.pdf'):
            name += '.pdf'
        return name

    def compute_rating(self):
        self.rating_number = self.rating_1+self.rating_2+\
                             self.rating_3+self.rating_4+self.rating_5
        self.rating_average = (self.rating_1+2*self.rating_2+3*\
                              self.rating_3+4*self.rating_4+5*\
                              self.rating_5) / float(self.rating_number)
        if self.rating_number>1:
            s = self.rating_1 * (1-self.rating_average)**2
            s += self.rating_2 * (2-self.rating_average)**2
            s += self.rating_3 * (3-self.rating_average)**2
            s += self.rating_4 * (4-self.rating_average)**2
            s += self.rating_5 * (5-self.rating_average)**2
            s /= float(self.rating_number-1)
            if s == 0:
                s = 0.1;
            lower_bound = self.rating_average - getT(self.rating_number-1)/\
                          sqrt(self.rating_number)*s;
            self.rating_lower_bound = lower_bound;


class Page(models.Model):
    num = models.IntegerField()
    height_120 = models.IntegerField()
    height_600 = models.IntegerField()
    height_900 = models.IntegerField()
    doc = models.ForeignKey(Document)


class PendingDocument(models.Model):
    doc = models.ForeignKey(Document)
    state = models.CharField(max_length=30)
    url = models.CharField(max_length=255)
    done = models.PositiveIntegerField(default=0)
