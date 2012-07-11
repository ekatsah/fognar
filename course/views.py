# Copyright 2012, Cercle Informatique. All rights reserved.

from djangbone.views import BackboneAPIView
from course.models import Course, CourseInfo
from course.forms import saveInfos

class course_bone(BackboneAPIView):
    base_queryset = Course.objects.all()
    serialize_fields = ('id', 'slug', 'name', 'description', 'infos')

class wiki_bone(BackboneAPIView):
    base_queryset = CourseInfo.objects.all()
    serialize_fields = ('id', 'user','user__name', 'infos', 'date', 'prev')
    edit_form_class = saveInfos    # Used for PUT requests
    
    def dispatch(self, request, *args, **kwargs):
        if request.method=='PUT':
            request.POST.rawdata
            return super(wiki_bone, self).dispatch(request, *args, **kwargs)
        elif request.method=='GET':    
            return super(wiki_bone, self).dispatch(request, *args, **kwargs)

