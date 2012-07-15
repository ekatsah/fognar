# Copyright 2012, Cercle Informatique. All rights reserved.

from config.json import json_send
from djangbone.views import BackboneAPIView
from course.models import Course, CourseInfo
from json import loads,dumps

class course_bone(BackboneAPIView):
    base_queryset = Course.objects.all()
    serialize_fields = ('id', 'slug', 'name', 'description', 'infos')

class wiki_bone(BackboneAPIView):
    base_queryset = CourseInfo.objects.all()
    serialize_fields = ('id', 'user','user__name', 'infos', 'date', 'prev')
    
    @json_send
    def dispatch(self, request, *args, **kwargs):
        if request.method=='POST':
            form = loads(request.raw_post_data)
            courseInfo = CourseInfo.objects.create(prev=CourseInfo.objects.get(pk=form['id']), user=request.user.get_profile(), infos=dumps(form['infos']))
            Course.objects.filter(pk=form['courseId']).update(infos=courseInfo)
            return 'OK'
        elif request.method=='GET':    
            return super(wiki_bone, self).dispatch(request, *args, **kwargs)

