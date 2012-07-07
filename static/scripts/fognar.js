// Copyright 2012, Cercle Informatique. All rights reserved.

var applications = {};
var models = {};
var cache = {};

applications.navbar = Backbone.View.extend({
    initialize: function(params) {
        $(this.el).prepend(templates['tpl-navbar']({real_name: profile.get('real_name')}));
        this.router = params.router;
        this.el = $('#navbar');
    },

    events: {
        'click #logo': function() {
            this.router.navigate('/desktop', {trigger: true});
        },
    },
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
            if (this.current_app != null)
                this.current_app.undelegateEvents();
            var config = this.config.where({name: url[0]})
            if (config.length != 0)
                config = eval('(' + config[0].get('config') + ')');
            else
                config = {};
            this.current_app = new applications[url[0]]({el: $('#content-wrapper'),
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
    var router = new ZoidRouter;
    router.config = config;
    _.each(autostart, function(k, el) {
        new applications[el]({router: router, el: $('body')});
    });
    Backbone.history.start();
});
