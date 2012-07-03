# Copyright 2012, RespLab. All rights reserved.

from www.json import json_sublist, json_send
from application.models import AppUsing

@json_send
def my_apps(request):
    apps = AppUsing.objects.filter(user=request.user)
    return json_sublist(request, apps, ['id', 'username', 
                ('get_profile.real_name', 'realname'),
                ('get_profile.registration', 'registration'),])
