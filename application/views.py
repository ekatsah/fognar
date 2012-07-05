# Copyright 2012, RespLab. All rights reserved.

from djangbone.views import BackboneAPIView

from config.json import json_list, json_send
from models import AppUsing
from forms import AppConfigForm


@json_send
def my_apps(request):
    apps = AppUsing.objects.filter(user=request.user)
    return json_list(request, apps, ['name', 'id', 'config'])


class ConfigView(BackboneAPIView):
    base_queryset = AppUsing.objects.all()
    serialize_fields = ('id', 'name', 'config', 'visited', 'last_visit', 'user')

    edit_form_class = AppConfigForm
    add_form_class = AppConfigForm
