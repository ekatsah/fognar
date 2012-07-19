from django.forms import ModelForm
from course.models import Course
from course.models import CourseInfo
from django.utils.html import escape
from json import dumps

class EditWikiForm(ModelForm):
    class Meta:
        model = Course

    def set_request(self, request):
        self.user = request.user.get_profile()
        self.request = request

    def save(self):
        newinfo = CourseInfo.objects.create(prev=self.instance, user=self.user, 
                                            infos=self.infos)

        for course in self.instance.course_set.all():
            course.infos = newinfo
            course.save()

        return newinfo

    def is_valid(self):
        try:
            self.infos = dumps([{
                'name': escape(cat['name']),
                'values': [{
                    'name': escape(subcat['name']),
                    'value': escape(subcat['value'])}
                    for subcat in cat['values']]}
                for cat in self.data['infos']])
            return True
        except:
            return False
