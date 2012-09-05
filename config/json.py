# Copyright 2012, Cercle Informatique. All rights reserved.

from datetime import datetime
from django.http import HttpResponse
from django.core import serializers


def json_seriz(request, queryset):
    data = serializers.serialize('json', queryset)
    return HttpResponse(data, 'application/javascript')


def json_string(value):
    table = {'\\': '\\u005C', '"': '\\u0022', '/': '\\u002F', '\b': '\\u0008',
             '\f': '\\u000C', '\n': '\\u000A', '\r': '\\u000D', '\t': '\\u009'}
    return ''.join([ table.get(v, v) for v in value ])


def json_sublist(value, depth=0):
    if depth > 10:
        return ""
    elif type(value) == tuple or type(value) == list:
        return '[' + ','.join(json_sublist(v, depth + 1) for v in value) + ']'
    else:
        return str(value)


def json_object(request, obj, fields, **kwargs):
    def get_recur_attr(obj, attrs):
        attr = attrs.pop(0)
        val = getattr(obj, attr, None)
        if val is None:
            try:
                val = obj[attr]
            except:
                pass
        if callable(val):
                val = val()
        if len(attrs) > 0:
            return get_recur_attr(val, attrs)
        else:
            return val

    object_str = []
    for field in fields:
        if type(field) == tuple:
            show = field[1]
            field = field[0]
        else:
            show = field

        value = get_recur_attr(obj, field.split('.'))
        field_name = show.replace('.', '_')

        if value is None:
            object_str.append('"%s": null' % field_name)

        elif type(value) == bool:
            object_str.append('"%s": %s' % (field_name, str(value).lower()))

        elif type(value) == unicode or type(value) == str:
            object_str.append('"%s": "%s"' % (field_name, json_string(value)))

        elif type(value) == int:
            object_str.append('"%s": "%d"' % (field_name, value))

        elif type(value) == tuple or type(value) == list:
            object_str.append('"%s": %s' % (field_name, json_sublist(value)))

        elif isinstance(value, datetime):
            object_str.append('"%s": "%s"' %
                              (field_name, value.strftime("%d/%m/%y %H:%M")))

        elif value.__class__.__name__ == 'ManyRelatedManager':
            ids = [ str(x.id) for x in value.all() ]
            object_str.append('"%s": [%s]' % (field_name, ",".join(ids)))

    return "{" + ",".join(object_str) + "}"


def json_list(request, queryset, fields, **kwargs):
    queryset = queryset() if callable(queryset) else queryset
    objects = [ json_object(request, obj, fields) for obj in queryset ]
    return "[" + ",".join(objects) + "]"


def json_select(request, queryset, fields, **kwargs):
    queryset = queryset() if callable(queryset) else queryset
    for k, v in kwargs.iteritems():
        queryset = queryset.filter(**{k: v})

    if len(queryset) == 0:
        return '{}'
    elif len(queryset) == 1:
        return json_object(request, queryset[0], fields)
    else:
        return json_sublist(request, queryset, fields)


def json_send(function):
    def send(*args, **kwargs):
        return HttpResponse(function(*args, **kwargs),
                            'application/javascript')
    return send
