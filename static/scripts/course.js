// Copyright 2012, Cercle Informatique. All rights reserved.

models.course = Backbone.Model.extend({
    initialize: function(params) {},
});

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
        this.course = new models.course({id: this.cid});
        this.course.url = urls['course_bone_id'](this.cid);
        this.course.on("change", function() { self.render(self.mode, true); });
        this.course.fetch();
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
            console.log("reprint course, => " + dump(this.course.toJSON()));
            if (this.sub_app != null) {
                this.sub_app.undelegateEvents();
                // FIXME remove app toussa
            }
            $(this.el).html(templates['tpl-course']({course: this.course.toJSON()}));
        }
        console.log('this.mode = "' + this.mode + '" && mode = "' + mode + '" && refresh = ' + refresh);
        if (this.mode != mode || refresh) {
            $('a[data-app="' + this.mode + '"]').removeClass('nav-active');
            $('a[data-app="' + mode + '"]').addClass('nav-active');
            this.mode = mode;
            if (this.sub_app != null) {
                this.sub_app.undelegateEvents();
                // FIXME remove app toussa
            }
            console.log(' -> reprint');
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
        this.infos = new Backbone.Model();
        this.infos.set({id: this.context.get('infos')});
        this.infos.url = urls['wiki_bone_id'];
        this.infos.parse = function(d) {
            d.infos = eval('(' + d.infos + ')');
            return d;
        };
        this.infos.on("change", this.render);
        this.infos.fetch();
        this.render();
    },

    update_after_add: function(key){
        $("#"+key+"_container").html(templates['tpl-wiki-form']({form: this.wiki.get_form(key)}));
    },

    events: {
        'click .edit': function(e) {
        	this.keyEditing = $(e.target).attr('data-target');
        	$("#" + this.keyEditing + "_container").html(
        	   templates['tpl-wiki-form']({
        	       form: this.infos.get_form(this.keyEditing)
        	   })
        	);
        	$(".edit").hide();
        	$(".signal").hide();
        },

        'click .signal': function(e) {
        	alert($(e.target).attr('data-target'));
        },

        'click #form_add_field': function() {
        	$("#current_edition").append(templates['wiki-form-add']());
        	$("#form_add_field").hide();
        },

        'click #wiki_form_add_submit': function() {
            var name = $('#wiki_form_add_key').val();
        	var value = $('#wiki_form_add_value').val();
        	this.infos.form_push(name,value);
			$("#" + this.keyEditing + "_container").html(
			    templates['tpl-wiki-form']({
			        form: this.infos.get_form(this.keyEditing)
			    })
			);
        },

        'click #form_confirm': function() {
        	this.infos.id = null;
        	this.infos.updateInfo()
        	this.infos.save();
        	$(this.el).html(templates['tpl-wiki']({wiki: this.infos.toJSON()}));
        },
    },

    render: function() {
        $(this.el).html(templates['tpl-wiki']({wiki: this.infos.toJSON()}));
		return this;
    },

    close: function() {},
});
