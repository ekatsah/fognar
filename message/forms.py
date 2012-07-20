from django.forms import ModelForm
from message.models import Thread, Message
from django.utils.html import escape
from message.views import get_context

class NewThreadForm(ModelForm):
    class Meta:
        model = Thread

    def set_request(self, request):
        self.user = request.user.get_profile()

    def save(self):
        # we need a better mecanism
        thing = get_context(self.data['type'], self.data['context'])
        thread = Thread.objects.create(subject=escape(self.data['subject']),
                                       user=self.user, referer=thing)
        Message.objects.create(user=self.user, thread=thread,
                               text=escape(self.data['text']))
        return thread

    def is_valid(self):
        for f in ['text', 'subject', 'type', 'context']:
            if len(self.data.get(f, '')) == 0:
                return False
        return True
