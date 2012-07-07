# Copyright 2012, Cercle Informatique. All rights reserved.

from djangbone.views import BackboneAPIView
from profile.models import Profile


class profile_bone(BackboneAPIView):
    base_queryset = Profile.objects.all()
    serialize_fields = ('id', 'name')
