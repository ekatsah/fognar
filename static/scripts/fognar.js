// Copyright 2012, RespLab. All rights reserved.

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
        if(this.current_app) {
            $(this.current_app.el).remove();
            this.current_app.unbind();
            this.current_app = undefined;
        }
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
            this.current_app = new applications[url[0]]({el: $('#application'),
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
