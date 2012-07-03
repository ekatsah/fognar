// Copyright 2012, RespLab. All rights reserved.

var ZoidRouter = Backbone.Router.extend({
    routes: {
        'profile': 'profile',
        '*url': 'other',
    },

    profile: function() {
        console.log('into profile');
    },

    other: function(url) {
        this.navigate('/profile', {trigger: true});
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
    Backbone.history.start();
});
