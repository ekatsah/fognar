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
    shortcuts = []
    for shortcut in request.user.profile.shortcut_set.all().values():
        shortcut["data"] = APPS_MODELS[shortcut["app"]].objects.filter(id=shortcut["app_id"]).values()[0]
        shortcuts.append(shortcut)

    return HttpResponse(dumps(shortcuts), mimetype="application/json")


def remove_shortcut(request, id):
    request.user.profile.shortcut_set.get(id=id).delete()
    return HttpResponse('success!')


urlpatterns = patterns('',
    url(r'^shortcuts/$',
        stop_anon(get_desktop_data),
        name="user_preference"),

    url(r'^shortcuts/remove/(?P<id>\d+)$',
        stop_anon(remove_shortcut),
        name="user_preference"),
)
