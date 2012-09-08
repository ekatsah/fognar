# Copyright 2012, Cercle Informatique. All rights reserved.

from json import dumps, loads

from django.conf.urls.defaults import patterns, url
from django.http import HttpResponse
from django.views.decorators.http import require_POST
from django.db.models import Max
from django import forms

from course.models import Course
from group.models import Group
from config.authentification import stop_anon
from models import Shortcut


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


class NewShortcut(forms.Form):
    app = forms.ChoiceField([('course', 'course')])
    app_id = forms.IntegerField()


@require_POST
def add_shortcut(request):
    form = NewShortcut(loads(request.raw_post_data))
    if not form.is_valid():
        return HttpResponse('<p>Bad data:</p>' + str(form.errors), status=400)

    max_position = Shortcut.objects.filter(user=request.user.profile).aggregate(Max('position'))['position__max']
    if not max_position:
        max_position = 1

    Shortcut.objects.create(user=request.user.profile,
        app=form.cleaned_data["app"],
        app_id=form.cleaned_data["app_id"],
        position=max_position + 1
    )
    return HttpResponse('success!')


urlpatterns = patterns('',
    url(r'^shortcuts/$',
        stop_anon(get_desktop_data),
        name="user_preference"),

    url(r'^shortcuts/remove/(?P<id>\d+)$',
        stop_anon(remove_shortcut),
        name="user_preference"),

    url(r'^shortcuts/add/$',
        stop_anon(add_shortcut),
        name="user_preference"),
)
