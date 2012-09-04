from course.models import Course
from group.models import Group
from django.shortcuts import get_object_or_404

def get_context(ctype, context):
    if ctype == 'course':
        return get_object_or_404(Course, id=context)
    elif ctype == 'group':
        return get_object_or_404(Group, id=context)
    else:
        # Force 404
        return get_object_or_404(Group, id="-1")
