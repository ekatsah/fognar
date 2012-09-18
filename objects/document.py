# Copyright 2012, UrLab. All rights reserved.

from django.db import models
from profile import Profile

class Document(models.Model):
    name = models.TextField()
    description = models.TextField()
    user = models.ForeignKey(Profile)
    referer_id = models.PositiveIntegerField()
    referer_content = models.CharField(max_length=100)

    size = models.PositiveIntegerField(null=True, default=0)
    words = models.PositiveIntegerField(null=True, default=0)
    pages = models.PositiveIntegerField(null=True, default=0)
    date = models.DateTimeField(auto_now=False, null=False)

    view = models.PositiveIntegerField(null=True, default=0)
    download = models.PositiveIntegerField(null=True, default=0)

    _public_fields = ['name', 'description', 'user', 'referer_id', 
                      'referer_content', 'size', 'words', 'pages', 'view', 
                      'download']
