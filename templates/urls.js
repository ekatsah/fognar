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
    _check_arguments: function(name) {
        for (i in arguments) {
            if (typeof arguments[i] == 'undefined')
            throw "Error: didn't get enough arguments to construct the url";
        }
    },
    'application': 'zoidberg',
    'auth_entry': function(a) { this._check_arguments("auth_entry", a); return 'auth/' + a; },
    'course_bone': 'course/',
    'course_bone_id': function(a) { this._check_arguments("course_bone_id", a); return 'course/' + a; },
    'document_bone': 'document/d/',
    'document_bone_id': function(a) { this._check_arguments("document_bone_id", a); return 'document/d/' + a; },
    'document_bone_type_id': function(a, b) { this._check_arguments("document_bone_type_id", a, b); return 'document/r/' + a + '/' + b; },
    'document_page': function(a) { this._check_arguments("document_page", a); return 'document/p/' + a; },
    'document_rate': function(a) { this._check_arguments("document_rate", a); return 'document/rate/' + a; },
    'document_upload_file': 'document/upload_file',
    'document_upload_http': 'document/upload_http',
    'index': '',
    'logout': 'logout',
    'message_bone': function(a) { this._check_arguments("message_bone", a); return 'msg/m/' + a; },
    'message_bone_id': function(a, b) { this._check_arguments("message_bone_id", a, b); return 'msg/m/' + a + '/' + b; },
    'profile_bone_id': function(a) { this._check_arguments("profile_bone_id", a); return 'profile/' + a; },
    'syslogin': 'syslogin',

    'wiki_bone_id': function (id) { this._check_arguments("wiki_bone_id", id); return 'course/wiki/' + id; },
    'wiki_bone_save': 'course/wikisave',

    'thread_bone': 'msg/t/',
    'thread_bone_id': function(a) { this._check_arguments("thread_bone_id", a); return 'msg/t/' + a; },
    'thread_bone_type_id': function(a, b) { this._check_arguments("thread_bone_type_id", a, b); return 'msg/r/' + a + '/' + b; },
};
