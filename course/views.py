# Copyright 2012, RespLab. All rights reserved.

from config.json import json_send
from djangbone.views import BackboneAPIView
from course.models import CourseInfo
from django.core.exceptions import ObjectDoesNotExist
from course.forms import saveInfos

class wiki_bone(BackboneAPIView):
    base_queryset = CourseInfo.objects.order_by('-date')
    serialize_fields = ('id','course','infos', 'date','course__name','course__slug','course__description')
    
    def dispatch(self, request, *args, **kwargs):
        try:
            self.base_queryset = wiki_bone.base_queryset.filter(course=kwargs['cid'])[0:1]
        except ObjectDoesNotExist:
            self.base_queryset = wiki_bone.base_queryset.none()
        return super(wiki_bone, self).dispatch(request,*args, **kwargs)

@json_send
def save_infos(request):
    data= request.POST.copy()
    return '{"message": '+data+'}'