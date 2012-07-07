# Copyright 2012, Cercle Informatique. All rights reserved.

from config.json import json_object, json_send
from djangbone.views import BackboneAPIView
from profile.models import Profile
from django.contrib.auth.models import User


class profile_bone(BackboneAPIView):
    base_queryset = User.objects.all()
    serialize_fields = ('
