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
    
    render: function() {
        $(this.el).html(templates['tpl-desk-course']({slug: this.slug}));
    },
});

models.Wiki = Backbone.Model.extend({
	initialize: function(id) {
		console.log('init model wiki');
		console.log(id)
    },
    
    get_form: function(key){
        for(i=0; (i<this.attributes.infos.length)&&(this.attributes.infos[i]['name']!=key); i++);
        this.currentEditing = i;
        return this.attributes.infos[i]['values'];
    },
    
    form_push: function(fname,fvalue){
    	this.attributes.infos[this.currentEditing]['values'].push({name: fname, value: fvalue});
    },
    
    
    updateInfo: function(){
    	var current = this.attributes.infos[this.currentEditing]['values'];
    	for(i=0; i<current.length; i++)
    		current[i]['value'] = $('#current_edition .form_'+current[i]['name']).val();
    	this.attributes.infos[this.currentEditing]['values'] = current;
    },
    
    close: function(){},
});

applications.wiki = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.type = params.type;
        this.context = params.context;
        this.infos = new models.Wiki({id: this.context.get('id')});
        this.infos.url = urls['wiki_bone_id'](this.context.get('infos'));
        this.infos.parse = function(d) {
            d.infos = eval('(' + d.infos + ')');
            return d;
        };
        this.infos.on("change", this.render);
        console.log(this);
        this.infos.fetch();
        this.render();
    },
    
    update_after_add: function(key){
        $("#"+key+"_container").html(templates['tpl-wiki-form']({form: this.wiki.get_form(key)}));
    },

    events: {
        'click .edit': function(e) {
        	this.keyEditing = $(e.target).attr('data-target');
        	$("#"+this.keyEditing+"_container").html(templates['tpl-wiki-form']({form: this.infos.get_form(this.keyEditing)}));
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
			$("#"+this.keyEditing+"_container").html(templates['tpl-wiki-form']({form: this.infos.get_form(this.keyEditing)}));
        },
        
        'click #form_confirm': function() {
        	this.infos.id = null;
        	this.infos.updateInfo()
        	this.infos.save();
        	$(this.el).html(templates['tpl-wiki']({wiki: this.infos.toJSON()}));
        },
    },
    render: function(mode, refresh) {
        $(this.el).html(templates['tpl-wiki']({wiki: this.infos.toJSON()}));
		return this;
    },

    close: function() {},
});
