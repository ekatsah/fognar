// Copyright 2012, RespLab. All rights reserved.

var applications = {};

applications.profile = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'render');
        this.me = new Backbone.Model();
        this.me.url = urls.profile_me;
        this.me.on("change", this.render);
        this.me.fetch()
        this.render();
    },

    events: {},

    render: function() {
        console.log("rendering");
        if (this.me.get('realname'))
            $(this.el).html(templates['tpl-profile'](this.me.toJSON()));
        else
            $(this.el).html(templates['tpl-loading']());
        return this;
    },
});

var ZoidRouter = Backbone.Router.extend({
    routes: {
        '*url': 'parser',
    },

    parser: function(url) {
        if (applications[url] == undefined)
            this.navigate('/profile', {trigger: true});
        else
            window.current_app = new applications.profile({el: $('#body')});
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
    Backbone.history.start();
});
