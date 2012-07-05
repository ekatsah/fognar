// Copyright 2012, RespLab. All rights reserved.

var applications = {};

applications.desktop = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.router = params.router;
        this.me = new Backbone.Model();
        this.me.url = urls.profile_me;
        this.me.on("change", this.render);
        this.me.fetch()
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
            $(this.el).html(templates['tpl-desktop'](this.me.toJSON()));
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
        if (applications[url[0]] == undefined)
            this.navigate('/desktop', {trigger: true});
        else
            window.current_app = new applications[url[0]]({el: $('#application'), 
                                                           router: this,
                                                           args: url});
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
