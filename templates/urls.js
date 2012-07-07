/* {% comment %} Copyright 2012, Cercle Informatique. All rights reserved. 
 * {% endcomment %} */

/* {% comment %}
from django.core.urlresolvers import get_resolver

sorted([
        (key, value[0][0][0])
        for key, value in get_resolver(None).reverse_dict.items()
        if isinstance(key, basestring)
])
{% endcomment %} */

urls = {
    'application': '{% url application %}',
    'application_me': '{% url application_me %}',
    'auth_entry': function(a) { return 'auth/' + a; },
    'index': '',
    'logout': '{% url logout %}',
    'syslogin': '{% url syslogin %}',
    'document_upload_http': '{% url document_upload_http %}',
    'document_upload_file': '{% url document_upload_file %}',
};
