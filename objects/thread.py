# Copyright 2012, UrLab. All rights reserved.

from django.db import models
from profile import Profile

class Thread(models.Model):
    subject = models.TextField()
    user = models.ForeignKey(Profile)
    referer_id = models.PositiveIntegerField()
    referer_content = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    tags = models.CharField(max_length=100)

    class Meta:
        ordering = ['-created']

    _public_fields = ['user.id', 'subject', 'referer_id', 'referer_content',
                      'tags']
