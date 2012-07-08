# Copyright 2012, Cercle Informatique. All rights reserved.

from djangbone.views import BackboneAPIView
from application.models import AppUsing
from application.forms import AppConfigForm


class ConfigView(BackboneAPIView):
    base_queryset = AppUsing.objects.all()
    serialize_fields = ('id', 'name', 'config', 'visited', 'last_visit', 'user')

    edit_form_class = AppConfigForm
    add_form_class = AppConfigForm
