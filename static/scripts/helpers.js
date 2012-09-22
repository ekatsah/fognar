// Copyright 2012, Cercle Informatique. All rights reserved.

// magic django function to handle csrf, don't bother with it

function get_cookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

$(document).ajaxSend(function(event, xhr, settings) {
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", get_cookie('csrftoken'));
    }
});
// end of magic function

function rdump_(obj, indent, depth) {
    if (depth > 10)
        return 'max depth';

    var str = '';
    for (key in obj)
        if (typeof obj[key] == 'object')
            str += indent + key + ':\n' + rdump_(obj, indent + '   ', depth + 1);
        else 
            str += indent + key + ': ' + obj[key] + '\n';
    return str;
}

function dump_(obj) {
    var str = '';
    for (key in obj)
        str += key + ': ' + obj[key] + '\n';
    return str;
}

function dump(obj) {
    return dump_(obj);
}

function recurloop(func, delay, times, count) {
    if (count == undefined)
        var count = 0;
    if (count < times) {
        func();
        setTimeout(function() { recurloop(func, delay, times, count + 1); }, delay);
    }
}

function format_referer(model, content, id) {
	return '/rest/refered/' + model + '/' +
		this.type.charAt(0).toUpperCase() + this.type.slice(1) + '/' +
		this.context.get('id');
}
