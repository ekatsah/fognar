# Copyright 2012, UrLab. All rights reserved.

from django.db import models
from document import Document

class PendingDocument(models.Model):
    document = models.ForeignKey(Document)
    state = models.CharField(max_length=30)
    url = models.CharField(max_length=255)
    done = models.PositiveIntegerField(default=0)

    _public_fields = ['id', 'document.id', 'state', 'done']
