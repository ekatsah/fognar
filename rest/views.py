# Copyright 2012, UrLab. All rights reserved.

from json import dumps
from django.http import HttpResponse, HttpResponseNotFound
from django.db.models import Q
from objects import models

model_names = [ model for model in dir(models) if model[0] != '_' ]
concat_q = lambda a, b: a | b

def field_lookup(obj, attrs):
    attr = attrs.pop(0)
    value = getattr(obj, attr, None)
    if value is None:
        try:
            value = obj[attr]
        except:
            pass
    if callable(value):
        value = value()
    if len(attrs) > 0:
        return field_lookup(value, attrs)
    else:
        return value

def format_results(request, model, queryset):
    results, uid, public = list(), request.user.id, len(model._public_fields)
    userness = (getattr(model, "user", False) and 
                getattr(model, "_private_fields", False))
    for q in queryset:
        if userness and q.user.id == uid:
            results.append({ f: field_lookup(q, f.split('.'))
                             for f in model._private_fields })
        elif public > 0:
            results.append({ f: field_lookup(q, f.split('.'))
                             for f in model._public_fields })

    if len(results) == 1:
        return HttpResponse(dumps(results[0]), mimetype='application/json')
    else:
        return HttpResponse(dumps(results), mimetype='application/json')

def refered_query(request, model, content, rid):
    if model not in model_names:
        return HttpResponseNotFound("%s don't seem to exist" % model)
    model = getattr(models, model)

    if not (getattr(model, "_public_fields", False) or 'referer_content' in
            model._public_fields or 'referer_id' in model._public_fields):
        return HttpResponseNotFound("%s don't seem to exist" % model)

    queryset = model.objects.filter(referer_content=content)
    queryset = queryset.filter(referer_id=rid)
    return format_results(request, model, queryset)

def query(request, model, field, ids):
    if model not in model_names:
        return HttpResponseNotFound("%s don't seem to exist" % model)
    model = getattr(models, model)

    queryset = model.objects.all()
    if not getattr(model, "_public_fields", False):
        model._public_fields = []

    if field == None or field not in model._public_fields:
        field = 'id'

    if ids:
        ids = ids.split(',')
        try:
            queryset = queryset.filter(reduce(concat_q, 
                                       [ Q(**{field: v}) for v in ids ]))
        except Exception as e:
            print "except " + str(e)
            queryset = []

    return format_results(request, model, queryset)