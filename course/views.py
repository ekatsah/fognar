# Copyright 2012, Cercle Informatique. All rights reserved.

from config.json import json_send
from djangbone.views import BackboneAPIView
from django.shortcuts import get_object_or_404
from course.models import Course, CourseInfo
from json import loads, dumps

class course_bone(BackboneAPIView):
    base_queryset = Course.objects.all()
    serialize_fields = ('id', 'slug', 'name', 'description', 'infos')

class wiki_bone(BackboneAPIView):
    base_queryset = CourseInfo.objects.all()
    serialize_fields = ('id', 'user','user__name', 'infos', 'date', 'prev')
    
    @json_send
    def dispatch(self, request, *args, **kwargs):
        if request.method=='POST':
            # FIXME what if corrupted?
            form = loads(request.raw_post_data)
            info = get_object_or_404(CourseInfo, pk=form['id'])
            newinfo = CourseInfo.objects.create(prev=info, 
                                                user=request.user.get_profile(), 
                                                infos=dumps(form['infos']))
            # WTF!?!?!? 
            Course.objects.filter(pk=form['courseId']).update(infos=newinfo)
            # 2eme WTF?? a function whom return json or text?? 
            return 'OK'
        elif request.method=='GET':    
            return super(wiki_bone, self).dispatch(request, *args, **kwargs)
