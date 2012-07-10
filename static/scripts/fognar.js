// Copyright 2012, Cercle Informatique. All rights reserved.

var applications = {};
var models = {};
var collections = {};
var cache = {};

applications.navbar = Backbone.View.extend({
    initialize: function(params) {
        $(this.el).prepend(templates['tpl-navbar']({
            name: window.profile.get('name')
        }));
        this.router = params.router;
        this.el = $('#navbar');
    },

    events: {
        'click #logo': function() {
            this.router.navigate('/desktop', {trigger: true});
        },
    },
    close: function() {},
});

applications.sidebar = Backbone.View.extend({
    initialize: function(params) {
        var self = this;
        _.bindAll(this, 'render', 'close', 'toggle', 'mask', 'show');
        this.router = params.router;
        this.visible = false;
        this.calling = null;
        window.sidebar = this;
        $(this.el).append(templates['tpl-sidebar']);
        $('#sidebar-backdrop').css("visibility", "hidden");
        $('#sidebar-backdrop').click(function() {
            self.mask();
        });
        this.el = $('#sidebar');
    },
    
    show: function(caller) {
        if (this.visible == false) {
            $('#sidebar').addClass("side-toolbar-opened");
            $('#sidebar-backdrop').removeClass("backdrop-hidden");
            $('#sidebar-backdrop').css("visibility", "visible");
            this.visible = true;
        }
        if (this.calling != null)
            this.undelegateEvents(this.calling.events);
        this.delegateEvents(caller.events);
        this.calling = caller;
    },
    
    mask: function() {
        if (this.visible) {
            $('#sidebar').removeClass("side-toolbar-opened");
            $('#sidebar-backdrop').addClass("backdrop-hidden");
            setTimeout(function() {
                $('#sidebar-backdrop').css("visibility", "hidden"); 
            }, 300);
            this.visible = false;
        }
        if (this.calling != null)
            this.undelegateEvents(this.calling.events);
        this.calling = null;
    },
    
    toggle: function(caller) {
        if (this.visible)
            this.mask();
        else
            this.show(caller);
    },

    render: function(content) {
        $('#sidebar-inner').html(content);
    },

    close: function() {},
});

var ZoidRouter = Backbone.Router.extend({
    initialize: function() {
        _.bindAll(this, 'parser');
        this.current_app = null;
    },

    routes: {
        '*args': 'parser',
    },

    parser: function(url) {
        url = url.split('/');
        if (typeof applications[url[0]] == "undefined") {
            this.navigate('/desktop', {trigger: true});
        }
        else {
            if (this.current_app != null) {
                this.current_app.undelegateEvents();
                this.current_app.close();
            }

            this.current_app = new applications[url[0]]({el: $('#content-wrapper'),
                router: this, args: url});
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
    var router = new ZoidRouter;
    _.each(autostart, function(k, el) {
        new applications[el]({router: router, el: $('body')});
    });
    Backbone.history.start();
});
