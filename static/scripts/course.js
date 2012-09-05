// Copyright 2012, Cercle Informatique. All rights reserved.

models.course = Backbone.Model.extend({
    initialize: function(params) {
        console.log("Initialize course model");
    },
});

collections.course = Backbone.Collection.extend({
    initialize: function() {
        console.log("Init course collection");
        _.bindAll(this, 'get_or_fetch');
    },

    model: models.course,
    url: urls['course_bone'],

    get_or_fetch: function(course_id) {
        var result = this.get(course_id);
        var self = this;
        if (result == undefined) {
            this.add({id: course_id});
            this.get(course_id).fetch({success: function() {
                self.trigger('fetched');
            }});
            return this.get(0);
        }
        return result;
    }
});

cache.course = new collections.course();


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
        this.course = cache.course.get_or_fetch(this.cid);
        //new models.course({id: this.cid});
        //this.course.url = urls['course_bone_id'](this.cid);
        //this.course.on("change", function() { self.render(self.mode, true); });
        //this.course.fetch();
        this.render(init_mode);
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

            this.sub_app = new applications[this.mode]({el: $('#course-content'),
                router: this.router, context: this.course, type: 'course'});
        }
        return this;
    },

    close: function() {},
});

applications.wikicourse = Backbone.View.extend({
    initialize: function(params) {
        console.log("Initialize wikicourse view");
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
            var parent = e.target.parentNode;
            var text = $(parent).children('.wiki-text');
            var input = document.createElement('input');
            $(input).addClass('wiki-input').val($(text).html());
            $(text).remove();
            $(parent).prepend(input);
        },

        'keypress .wiki-input': function(e) {
            if ((e.keyCode ? e.keyCode : e.which) == 13) {
                var text = $(e.target).val();
                var parent = e.target.parentNode;
                var div = document.createElement('div');
                $(div).addClass('wiki-text').html(text);
                $(e.target).remove();
                $(parent).prepend(div);
                $('#wiki-save').css('display', 'block');
            }
        },

        'click #wiki-save': function(e) {
            var new_info = Array();
            $('#wiki article').each(function(idx, elt) {
                var values = Array();
                $(elt).children('ul').children('li').each(function(idx, elt) {
                    values.push({
                        name: $(elt).children('.wiki-label').html(),
                        value: $(elt).children('.wiki-content').children('.wiki-text').html()
                    });
                });
                new_info.push({
                    name: $(elt).children('h2').html(),
                    values: values,
                });
            });
            this.infos.save({infos: new_info});
        },
    },

    render: function() {
        this.context.set({infos: this.infos.get('id')}, {silent: true});
        $(this.el).html(templates['tpl-wiki']({wiki: this.infos.toJSON()}));
        return this;
    },

    close: function() {},
});
