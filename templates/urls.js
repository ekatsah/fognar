/* {% comment %} Copyright 2012, Cercle Informatique. All rights reserved. 
 * {% endcomment %} */

/* {% comment %}
from django.core.urlresolvers import get_resolver

urls = sorted([
        (key, value[0][0][0])
        for key, value in get_resolver(None).reverse_dict.items()
        if isinstance(key, basestring)
])

for url in urls:
    print "    '%s': '%s'," % url

{% endcomment %} */

urls = {
    'app_config': 'application/config/',
    'app_config_id': 'application/config/%(id)s',
    'application': 'zoidberg',
    'auth_entry': function(a) { return 'auth/' + a; },
    'course_bone': 'course/',
    'document_bone': 'document/d/',
    'document_bone_id': function(a) { return 'document/d/' + a; },
    'document_bone_type_slug': function (a, b) { return 'document/r/' + a + '/' + b; },
    'document_upload_file': 'document/upload_file',
    'document_upload_http': 'document/upload_http',
    'index': '',
    'logout': 'logout',
    'profile_bone_id': function (a) { return 'profile/' + a; },
    'syslogin': 'syslogin',
    'wiki_bone_type_id': function (id) { return 'course/wiki/' + id; },
    'wiki_bone_save': 'course/wikisave',
};
