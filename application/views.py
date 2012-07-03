# Copyright 2012, RespLab. All rights reserved.

from config.json import json_object, json_send
from application.models import AppUsing

@json_send
def my_apps(request):
    apps = AppUsing.objects.filter(user=request.user)
    return json_object(request, request.user, ['id', 'username', 
                ('get_profile.real_name', 'realname'),
                ('get_profile.registration', 'registration'),])
