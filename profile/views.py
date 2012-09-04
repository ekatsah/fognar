# Copyright 2012, Cercle Informatique. All rights reserved.

from djangbone.views import BackboneAPIView
from profile.models import Profile


class ProfileBone(BackboneAPIView):
    base_queryset = Profile.objects.all()
    serialize_fields = ('id', 'name')
