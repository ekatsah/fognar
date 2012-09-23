# Copyright 2012, UrLab. All rights reserved.

from django.db import models
from document import Document

class Page(models.Model):
    document = models.ForeignKey(Document)
    numero = models.IntegerField()
    height_120 = models.IntegerField()
    height_600 = models.IntegerField()
    height_900 = models.IntegerField()

    _public_fields = ['id', 'document.id', 'numero', 'height_120', 'height_600', 
                      'height_900']
