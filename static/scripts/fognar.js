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

applications.desktop = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.router = params.router;
        this.me = new Backbone.Model();
        this.me.url = urls.profile_me;
        this.me.on("change", this.render);
        this.me.fetch();
        this.shortcuts = new Backbone.Collection();
        this.shortcuts.model = ShortCut;
        this.shortcuts.url = function() {
           return urls.application_me;
        }
        this.shortcuts.fetch();
        this.shortcuts.bind("all", this.render);
        this.render();
    },

    events: {
        'click #market': function() {
            this.router.navigate('/market', {trigger: true});
            return false;
        },
    },

    render: function() {
        console.log("desktop rendering");
        if (this.me.get('realname'))
            $(this.el).html(templates['tpl-desktop']({profil: this.me.toJSON(), 
                applications: this.shortcuts.toJSON()}));
        else
            $(this.el).html(templates['tpl-loading']());
        return this;
    },
});

applications.market = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'render');
        this.render();
    },

    events: {},

    render: function() {
        console.log("market render");
        $(this.el).html(templates['tpl-market']());
        return this;
    },
});

applications.course = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'render');
        this.render();
    },

    events: {},

    render: function() {
        console.log("course render");
        $(this.el).html(templates['tpl-course']());
        return this;
    },
});

applications.viewer = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'render');
        this.render();
    },

    events: {},

    render: function() {
        console.log("viewer render");
        $(this.el).html(templates['tpl-viewer']());
        return this;
    },
});

applications.group = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'render');
        this.render();
    },

    events: {},

    render: function() {
        console.log("group render");
        $(this.el).html(templates['tpl-group']());
        return this;
    },
});

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
            console.log("DEBUG: no url, got to desktop")
            this.navigate('/desktop', {trigger: true});
        }
        else {
            console.log("DEBUG: go to application " + url[0])
            window.current_app = new applications[url[0]]({el: $('#application'), 
                                                           router: this,
                                                           args: url});
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

    // start application

    console.log("starting...")

    var router = new ZoidRouter;
    _.each(autostart, function(k, el) {
        new applications[el]({router: router, el: $('#body')});
    });
    Backbone.history.start();
});
