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
        'course/:id/document': 'document',
        'course/:id': 'course',
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

    document: function(id) {
        this.remove_views();
        $('#content-wrapper').html(templates['two-columns']());
        this.current_app.push(new applications.page_title({
            el: $('#page-title'),
            model_name: 'course',
            object_id: id,
        }));
        this.current_app.push(new applications.document({
            el: $('#main-sided-wrapper'),
            referer_id: id,
            referer_content: 'Course',
        }));
        this.current_app.push(new applications.course_sidebar({
            el: $('#large-sidebar-wrapper'),
            course_id: id,
        }));
    },

    course: function(id) {
        this.navigate('course/' + id + '/document', {
            replace: true,
            trigger: true,
        });
    },

    other: function(url) {
        this.remove_views();
        $('#content-wrapper').html(templates['other']({
            url: url,
        }));
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
