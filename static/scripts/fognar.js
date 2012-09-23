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
        _.bindAll(this, 'parser');
        this.current_app = null;
    },

    routes: {
        '*args': 'parser',
    },

    parser: function(url) {
        url = url.split('/');
        if (typeof applications[url[0]] == "undefined")
            return this.navigate('/desktop', {trigger: true});

        if (this.current_app != null) {
            this.current_app.undelegateEvents();
            this.current_app.close();
        }

        this.current_app = new applications[url[0]]({
            el: $('#content-wrapper'),
            router: this, args: url,
        });
    },
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
