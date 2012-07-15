// Copyright 2012, Cercle Informatique. All rights reserved.

models.course = Backbone.Model.extend({
    initialize: function(params) {},
});

collections.course = Backbone.Collection.extend({
    initialize: function() {
    	_.bindAll(this, 'get_or_fetch');
    },

    model: models.course,
    url: urls['course_bone'],

    get_or_fetch: function(cid) {
        var ret = this.get(cid);
        var self = this;
        if (ret == undefined) {
            this.add({id: cid});
            this.get(cid).fetch({success: function() {
                self.trigger('fetched');
            }});
            return this.get(0);
        }
        return ret;
    }
});

cache.course = new collections.course();


applications.course = Backbone.View.extend({
    initialize: function(params) {
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
        this.course = cache.course.get_or_fetch(this.cid);
        //new models.course({id: this.cid});
        //this.course.url = urls['course_bone_id'](this.cid);
        //this.course.on("change", function() { self.render(self.mode, true); });
        //this.course.fetch();
        this.render(init_mode);
    },

    events: {
        'click .x_action': function(e) {
            var app = $(e.target).attr("data-app");
            this.router.navigate('/course/' + this.cid + '/' + app, 
                                 {trigger: false});
            this.render(app);
            return false;
        },
    },

    render: function(mode, refresh) {
        // FIXME check if mode is valid
        if (this.first || refresh) {
            this.first = false;

            if (this.sub_app != null) {
                this.sub_app.undelegateEvents();
                // FIXME remove app toussa
            }
            $(this.el).html(templates['tpl-course']({course: this.course.toJSON()}));
        }

        if (this.mode != mode || refresh) {
            $('a[data-app="' + this.mode + '"]').removeClass('nav-active');
            $('a[data-app="' + mode + '"]').addClass('nav-active');
            this.mode = mode;
            if (this.sub_app != null) {
                this.sub_app.undelegateEvents();
                // FIXME remove app toussa
            }

            this.sub_app = new applications[this.mode]({el: $('#course-content'),
                router: this.router, context: this.course, type: 'course'});
        }
        return this;
    },

    close: function() {},
});

applications.wikicourse = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.type = params.type;
        this.context = params.context;
        this.infos = new Backbone.Model({id: this.context.get('infos')});
        this.infos.url = urls['wiki_bone_id'](this.infos.get('id'));
        this.infos.parse = function(d) {
            d.infos = eval('(' + d.infos + ')');
            return d;
        };
        this.infos.on("change", this.render);
        this.infos.fetch();
        this.render();
    },

    events: {
        'click .wiki-edit': function(e) {
            var parent = e.target.parentElement;
            var text = $(parent).children('.wiki-text');
            var input = document.createElement('input');
            $(input).val($(text).html());
            $(text).remove();
            $(parent).prepend(input);
        },
    },

    render: function() {
        $(this.el).html(templates['tpl-wiki']({wiki: this.infos.toJSON()}));
		return this;
    },

    close: function() {},
});
