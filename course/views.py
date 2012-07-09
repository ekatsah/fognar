# Copyright 2012, Cercle Informatique. All rights reserved.

from djangbone.views import BackboneAPIView
from course.models import Course, CourseInfo

class course_bone(BackboneAPIView):
    base_queryset = Course.objects.all()
    serialize_fields = ('id', 'slug', 'name', 'description')

class wiki_bone(BackboneAPIView):
    base_queryset = CourseInfo.objects.order_by('-date')
    serialize_fields = ('id','course','infos', 'date')

    def dispatch(self, request, *args, **kwargs):
        try:
            c = Course.objects.get(id=kwargs['cid'])
            self.base_queryset = wiki_bone.base_queryset.filter(course=c)[0:1]
        except:
            self.base_queryset = wiki_bone.base_queryset.none()

        return super(wiki_bone, self).dispatch(request,*args, **kwargs)
