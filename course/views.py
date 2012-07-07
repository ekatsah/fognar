# Copyright 2012, RespLab. All rights reserved.

from djangbone.views import BackboneAPIView
from course.models import CourseInfo, Course
from django.core.exceptions import ObjectDoesNotExist

class wiki_bone(BackboneAPIView):
    base_queryset = CourseInfo.objects.order_by('-date')
    serialize_fields = ('id','course','infos', 'date')
    
    def dispatch(self, request, *args, **kwargs):
        try:
            course = Course.objects.get(id=kwargs['cid'])
            self.base_queryset = wiki_bone.base_queryset.filter(course=course)[0:1]
        except ObjectDoesNotExist:
            self.base_queryset = wiki_bone.base_queryset.none()
        return super(wiki_bone, self).dispatch(request,*args, **kwargs)
