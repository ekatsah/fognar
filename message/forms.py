from django import forms
from message.models import Thread, Message, CATEGORIES
from django.utils.html import escape
from django.shortcuts import get_object_or_404

from profile.models import Profile
from course.models import Course
from config.utils import get_context


class NewThreadForm(forms.ModelForm):
    class Meta:
        model = Thread

    def set_request(self, request):
        self.user = request.user.get_profile()

    def save(self):
        # we need a better mecanism
        print "save"
        thing = get_context(self.data['type'], self.data['context'])
        thread = Thread.objects.create(subject=escape(self.data['subject']),
                                       user=self.user, referer=thing)
        Message.objects.create(user=self.user, thread=thread,
                               text=escape(self.data['text']))
        return thread

    def is_valid(self):
        for f in ['text', 'subject', 'type', 'context']:
            if len(str(self.data.get(f, ''))) == 0:
                return False
        return True


class NewCourseThreadForm(forms.Form):
    subject = forms.CharField()
    user = forms.IntegerField()
    category = forms.ChoiceField(CATEGORIES)
    course = forms.IntegerField()

    def save(self):
        # djangbone will do a is_valid check for us
        return Thread.objects.create(
            subject=self.cleaned_data["subject"],
            user=get_object_or_404(Profile, id=self.cleaned_data["user"]),
            referer=get_object_or_404(Course, id=self.cleaned_data["course"]),
            category=self.cleaned_data["category"],
        )


class NewMessageForm(forms.ModelForm):
    class Meta:
        model = Message
        exclude = ('reference',)
