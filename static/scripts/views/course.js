// Copyright 2012, Cercle Informatique. All rights reserved.

models.course = Backbone.Model.extend({
    initialize: function(params) {
        console.log("Initialize course model");
    },
});

collections.course = Backbone.Collection.extend({
    model: models.course,
    url: '/rest/Course/',
});

applications.course = Backbone.View.extend({
    el: $("content-wrapper"),
    events: {
        'click .x_action': 'handle_sidebar',
    },

    initialize: function(params) {
        console.log("Initialize course view");
        _.bindAll(this, 'render');
        var self = this;
        // FIXME check if init_mode is valid
        if (typeof params.args[2] == 'undefined')
            var init_mode = "thread";
        else
            var init_mode = params.args[2];
        this.mode = null;
        this.first = true;
        this.sub_app = null;
        this.cid = params.args[1];
        this.router = params.router;
        this.router.navigate('/course/' + this.cid + '/' + init_mode,
                             {trigger: false, replace: true});
        this.course = new Backbone.Model({
            id: this.cid,
        });
        this.course.model = models.course;
        this.course.url = "/rest/Course/" + this.cid;
        var self = this;
        this.course.fetch({
            success: function() {
                console.log("zob");
                self.render(init_mode);
            },
        })
    },

    handle_sidebar: function(e) {
        var app = $(e.target).attr("data-app");
        this.router.navigate('/course/' + this.cid + '/' + app,
                             {trigger: false});
        this.render(app);
        return false;
    },

    render: function(mode, refresh) {
        // FIXME check if mode is valid
        if (this.first || refresh) {
            this.first = false;

            if (this.sub_app != null) {
                this.sub_app.undelegateEvents();
                // FIXME remove app toussa
            }
            this.$el.html(templates['tpl-course']({course: this.course.toJSON()}));
        }

        if (this.mode != mode || refresh) {
            // put current tab in red in right sidebar
            $('a[data-app="' + this.mode + '"]').removeClass('nav-active');
            $('a[data-app="' + mode + '"]').addClass('nav-active');
            this.mode = mode;
            if (this.sub_app != null) {
                this.sub_app.undelegateEvents();
                // FIXME remove app toussa
            }

            console.log("Create new application for mode '" + mode + "' of type 'course'");
            this.sub_app = new applications[this.mode]({el: $('#course-content'),
                router: this.router, context: this.course, type: 'course'});
        }
        return this;
    },

    close: function() {
        cache.course.unbind("change add", this.render);
    },
});
