# Copyright 2012, RespLab. All rights reserved.

from config.json import json_object, json_send, json_list
from category.models import Category, CategoryItem
from django.shortcuts import get_object_or_404


@json_send
def get_category(request, object_id):
    category = get_object_or_404(Category, id=object_id)
    res = json_object(request, category, ['id', 'name', 'description'])
    holds = json_list(request, category.holds.all(), ['id', 'name'])
    content, items = list(), CategoryItem.objects.filter(category=category)
    for i in items:
        obj = i.object_content.get_object_for_this_type(id=i.object_id)
        content.append({'id': obj.id, 'name': obj.name, 'slug': obj.slug,
                        'priority': i.priority, 'type': i.object_content.model})

    return res[:-1] + ', "items": '+ json_list(request, content, ['id',
           'name', 'slug', 'priority', 'type']) + ', "holds": ' + holds + '}'
