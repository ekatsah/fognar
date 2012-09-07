# Copyright 2012, RespLab. All rights reserved.

from json import dumps

from django.conf.urls.defaults import patterns, url
from django.http import HttpResponse
from config.authentification import stop_anon
from course.views import CourseBone, WikiBone
from models import Course


def courses_for_the_market(request):
    already_added_courses = map(lambda x: x.app_id, request.user.profile.shortcut_set.filter(app="course"))
    courses = filter(lambda x: x["id"] not in already_added_courses, Course.objects.all().values())
    return HttpResponse(dumps(courses), mimetype="application/json")


urlpatterns = patterns('',
    url(r'^$',
        stop_anon(CourseBone.as_view()),
        name="course_bone"),

    url(r'^market/$',
        stop_anon(courses_for_the_market),
        name="course_bone"),

    url(r'^(?P<id>\d+)$',
        stop_anon(CourseBone.as_view()),
        name="course_bone_id"),

    url(r'^wiki/(?P<id>\d+)$',
        stop_anon(WikiBone.as_view()),
        name="wiki_bone_id"),
)
