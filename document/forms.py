# Copyright 2012, Cercle Informatique. All rights reserved.

from django import forms

class UploadFileForm(forms.Form):
    filename = forms.CharField()
    description = forms.CharField()
    xfile = forms.FileField()
    context = forms.CharField()
    ctype = forms.CharField()

class UploadHttpForm(forms.Form):
    filename = forms.CharField()
    description = forms.CharField()
    url = forms.RegexField(r'.*\.[pP][dD][fF]$')
    context = forms.CharField()
    ctype = forms.CharField()
