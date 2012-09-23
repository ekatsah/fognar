// Copyright 2012, UrLab. All rights reserved.

var applications = {};

applications.navbar = Backbone.View.extend({
    initialize: function(params) {
        console.log("initialize navbar view");
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

var ZoidRouter = Backbone.Router.extend({
    initialize: function() {
        _.bindAll(this, 'remove_views', 'desktop');
        this.current_app = [];
    },

    routes: {
        'desktop': 'desktop',
        '*url': 'other',
    },

    remove_views: function() {
        _(this.current_app).each(function(view) {
            view.undelegateEvents();
            view.close();
        });
        this.current_app = [];
    },
    
    desktop: function() {
        this.remove_views();
        this.current_app.push(new applications.desktop({
            el: $('#content-wrapper'),
            router: this,
        }));
    },

    other: function(url) {
        console.log("other matched on " + url);
    }
});

$(document).ready(function() {
    // template compilation
    templates = {};
    _.each(fragments, function (content, key) {
        templates[key] = Handlebars.compile(content);
        Handlebars.registerPartial(key, content);
    });

    // start application
    var router = new ZoidRouter;
    _.each(autostart, function(k, el) {
        new applications[el]({router: router, el: $('body')});
    });
    Backbone.history.start();
});
