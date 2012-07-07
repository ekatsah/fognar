# Copyright 2012, Cercle Informatique. All rights reserved.

from profile.models import Profile
from django.db import models

META_ROLE = ['Leader', 'Accounting', 'Administrator', 'Party', 'Academique', 
             'Other'] # todo

class Group(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField()
    description = models.TextField(null=True)
    info = models.TextField(null=True)

class GroupMember(models.Model):
    user = models.ForeignKey(Profile)
    title = models.TextField()
    role = models.TextField()

class Publication(models.Model):
    group = models.ForeignKey(Group)
    slug = models.CharField(unique=True, max_length=250)
    subject = models.TextField()
    text = models.TextField()
    date = models.DateTimeField(auto_now=True)
    added_by = models.ForeignKey(Profile)
