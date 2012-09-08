# Copyright 2012, Cercle Informatique. All rights reserved.

from json import dumps

from django.conf.urls.defaults import patterns, url
from django.http import HttpResponse

from course.models import Course
from group.models import Group
from config.authentification import stop_anon


APPS_MODELS = {
    "course": Course,
    "group": Group,
}


def get_desktop_data(request):
    desktop = list(request.user.profile.shortcut_set.all().values())
    for shortcut in desktop:
        data = APPS_MODELS[shortcut["app"]].objects.get(id=shortcut["app_id"])
        shortcut["name"] = data.name
        shortcut["slug"] = data.slug
        shortcut["description"] = data.description
    return HttpResponse(dumps(desktop), mimetype="application/json")


urlpatterns = patterns('',
    url(r'^$',
        stop_anon(get_desktop_data),
        name="user_desktop"),
)
