// Copyright 2012, Cercle Informatique. All rights reserved.

models.course = Backbone.Model.extend({
    initialize: function(params) {
        console.log('new course model');
    },
    
});

applications.course = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.mode = null;
        this.first = true;
        this.sub_app = null;
        this.slug = params.args[1];
        this.router = params.router;
        this.router.navigate('/course/' + this.slug + '/thread', 
                             {trigger: false});
        this.course = new models.course({slug: this.slug});
        this.course.url = urls['course_bone_slug'](this.slug);
        this.course.on("all", this.render);
        this.course.fetch();
        this.render(this.mode);
    },

    events: {
        'click .x_action': function(e) {
            var app = $(e.target).attr("data-app");
            this.router.navigate('/course/' + this.slug + '/' + app, 
                                 {trigger: false});
            this.render(app);
            return false;
        },
    },

    render: function(mode) {
        // FIXME check if mode is valid
        if (this.first) {
            this.first = false;
            $(this.el).html(templates['tpl-course']({slug: this.slug}));
        }

        if (this.mode != mode) {
            $('#' + mode).addClass('nav-active');
            $('#' + this.mode).removeClass('nav-active');
            this.mode = mode;
            if (this.sub_app != null) {
                this.sub_app.undelegateEvents();
                // FIXME remove app toussa
            }
            this.sub_app = new application[this.mode]({el: $('#course-content'),
                router: this.router, context: this.course, type: 'course'});
        }
    },

    close: function() {},
});
