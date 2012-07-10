/* {% comment %} Copyright 2012, Cercle Informatique. All rights reserved. 
 * {% endcomment %} */

/* {% comment %}
from django.core.urlresolvers import get_resolver
from re import search

urls = sorted([
        (key, value[0][0][0])
        for key, value in get_resolver(None).reverse_dict.items()
        if isinstance(key, basestring)
])

for url in urls:
    if search('%', url[1]):
        print "    '%s': function() { return '%s'; }," % url
    else:
        print "    '%s': '%s'," % url

{% endcomment %} */

urls = {
    'application': 'zoidberg',
    'auth_entry': function(a) { return 'auth/' + a; },
    'course_bone_id': function(a) { return 'course/' + a; },
    'document_bone': 'document/d/',
    'document_bone_id': function(a) { return 'document/d/' + a; },
    'document_bone_type_id': function(a, b) { return 'document/r/' + a + '/' + b; },
    'document_page': function(a) { return 'document/p/' + a; },
    'document_rate': function(a) { return 'document/rate/' + a; },
    'document_upload_file': 'document/upload_file',
    'document_upload_http': 'document/upload_http',
    'index': '',
    'logout': 'logout',
    'message_bone': function(a) { return 'msg/m/' + a; },
    'message_bone_id': function(a, b) { return 'msg/m/' + a + '/' + b; },
    'profile_bone_id': function(a) { return 'profile/' + a; },
    'syslogin': 'syslogin',

    'wiki_bone_id': function (id) { return 'course/wiki/' + id; },
    'wiki_bone_save': 'course/wikisave',

    'thread_bone': 'msg/t/',
    'thread_bone_id': function(a) { return 'msg/t/' + a; },
    'thread_bone_type_id': function(a, b) { return 'msg/r/' + a + '/' + b; },
};
