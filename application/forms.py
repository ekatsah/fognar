# Copyright 2012, Cercle Informatique. All rights reserved.

from django.forms import ModelForm

from models import AppUsing


class AppConfigForm(ModelForm):
    class Meta:
        model = AppUsing
