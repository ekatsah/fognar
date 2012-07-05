// Copyright 2012, RespLab. All rights reserved.


// magic django function to handle csrf, don't bother with it
$(document).ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
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
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});
// end of magic function

var applications = {};

var ShortCut = Backbone.Model.extend({
    url: function() {
        return "/application/config/" + this.id + "/";
    }
})

applications.navbar = Backbone.View.extend({
    initialize: function(params) {
        $(this.el).prepend(templates['tpl-navbar']());
        this.router = params.router;
        this.el = $('#navbar');
    },

    events: {
        'click #desk_button': function() {
            this.router.navigate('/desktop', {trigger: true});
        },
    },
});

var ZoidRouter = Backbone.Router.extend({
    routes: {
        '*args': 'parser',
    },

    parser: function(url) {
        url = url.split('/');
        if (applications[url[0]] == undefined) {
            console.log("DEBUG: no url, go to desktop")
            this.navigate('/desktop', {trigger: true});
        }
        else {
            console.log("DEBUG: go to application " + url[0])
            var config = this.config.where({name: url[0]})
            if (config.length != 0)
                config = eval('(' + config[0].get('config') + ')');
            else
                config = {};
            window.current_app = new applications[url[0]]({el: $('#application'),
                router: this, args: url, config: config});
        }
    },
});

$(document).ready(function() {
    // template compilation
    templates = {};
    _($('*[type="text/x-handlebars-template"]')).each(function(t) {
        templates[t.id] = Handlebars.compile($(t).html());
        Handlebars.registerPartial(t.id, $(t).html());
    });

    // make ajax synchronous for config fetch. TODO : bootstraping
    $.ajaxSetup({ async: false });
    var config = new Backbone.Collection();
    config.url = urls.application_me;
    config.fetch();
    $.ajaxSetup({ async: true });

    // start application
    console.log("starting...")

    var router = new ZoidRouter;
    router.config = config;
    _.each(autostart, function(k, el) {
        new applications[el]({router: router, el: $('#body')});
    });
    Backbone.history.start();
});
