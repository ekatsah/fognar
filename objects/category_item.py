# Copyright 2012, UrLab. All rights reserved.

from django.db import models
from category import Category

class CategoryItem(models.Model):
    category = models.ForeignKey(Category)
    item_id = models.PositiveIntegerField()
    item_content = models.CharField(max_length=100)
    priority = models.PositiveIntegerField()

    _public_fields = ['category', 'item_id', 'item_content', 'priority']
