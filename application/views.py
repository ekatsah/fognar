# Copyright 2012, RespLab. All rights reserved.

from config.json import json_list, json_send
from application.models import AppUsing

@json_send
def my_apps(request):
    apps = AppUsing.objects.filter(user=request.user)
    return json_list(request, apps, ['name', 'config'])
