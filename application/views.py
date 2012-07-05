# Copyright 2012, RespLab. All rights reserved.

from django.shortcuts import get_object_or_404
from django.http import HttpResponse

from config.json import json_list, json_send
from application.models import AppUsing

@json_send
def my_apps(request):
    apps = AppUsing.objects.filter(user=request.user)
    return json_list(request, apps, ['name', 'id', 'config'])



def get_config(request, app_id):
    app = get_object_or_404(AppUsing, pk=app_id)
    return HttpResponse(app.config if app.config else "{}")
