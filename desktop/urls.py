# Copyright 2012, Cercle Informatique. All rights reserved.

from json import loads, dumps

from django.conf.urls.defaults import patterns, url
from django.http import HttpResponse

from course.models import Course
from group.models import Group
from config.authentification import stop_anon
from profile.models import Profile


APPS_MODELS = {
    "course": Course,
    "group": Group,
}


def get_desktop_data(request):
    desktop_config = Profile.objects.get(user=request.user).desktop_config
    if not desktop_config:
        return HttpResponse("{}", mimetype="application/json")

    desktop_config = loads(desktop_config)

    desktop = []
    for app in desktop_config.get("shortcuts"):
        desktop.append(APPS_MODELS[app["app"]].objects.filter(id=app["id"]).values()[0])
        desktop[-1]["app_id"] = desktop[-1].pop("id") # backbone want that fields named id=unique
        desktop[-1]["app"] = app["app"]

    return HttpResponse(dumps(desktop), mimetype="application/json")


urlpatterns = patterns('',
    url(r'^$',
        stop_anon(get_desktop_data),
        name="user_desktop"),
)
