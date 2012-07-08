// Copyright 2012, Cercle Informatique. All rights reserved.

models.course = Backbone.Model.extend({
    initialize: function(params) {},
});

applications.course = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        var self = this;
        this.mode = null;
        this.first = true;
        this.sub_app = null;
        this.slug = params.args[1];
        this.router = params.router;
        this.router.navigate('/course/' + this.slug + '/thread', 
                             {trigger: false, replace: true});
        this.course = new models.course({slug: this.slug});
        this.course.url = urls['course_bone_slug'](this.slug);
        this.course.on("change", function() { self.render(self.mode, true); });
        this.course.fetch();
        this.render('thread');
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

    render: function(mode, refresh) {
        // FIXME check if mode is valid
        if (this.first || refresh) {
            this.first = false;
            console.log("reprint course, => " + dump(this.course.toJSON()));
            if (this.sub_app != null) {
                this.sub_app.undelegateEvents();
                // FIXME remove app toussa
            }
            $(this.el).html(templates['tpl-course']({course: this.course}));
        }
        console.log('this.mode = "' + this.mode + '" && mode = "' + mode + '" && refresh = ' + refresh);
        if (this.mode != mode || refresh) {
            $('a[data-' + mode + ']').addClass('nav-active');
            $('a[data-' + this.mode + ']').removeClass('nav-active');
            this.mode = mode;
            if (this.sub_app != null) {
                this.sub_app.undelegateEvents();
                // FIXME remove app toussa
            }
            console.log('  -> reprint');
            this.sub_app = new applications[this.mode]({el: $('#course-content'),
                router: this.router, context: this.course, type: 'course'});
        }
        return this;
    },

    close: function() {},
});
