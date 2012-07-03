/* {% comment %} Copyright 2012, RespLab. All rights reserved. {% endcomment %} */

/* {% comment %}
from django.core.urlresolvers import get_resolver

sorted([
        (key, value[0][0][0])
        for key, value in get_resolver(None).reverse_dict.items()
        if isinstance(key, basestring)
])
{% endcomment %} */

urls = {
    'application': 'zoidberg',
    'auth_entry': function(a) { return 'auth/' + a; },
    'index': '',
    'logout': 'logout',
    'syslogin': 'syslogin',
};
