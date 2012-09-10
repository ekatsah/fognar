# Copyright 2012, UrLab. All rights reserved.

from django.http import HttpResponse

def query(request, model, field, ids):
    if field == None:
        field = 'id'
    return HttpResponse('<pre>model = %s\nfield = %s\nids = %s</pre>' % 
                        (model, field, ids))
