// Copyright 2012, Cercle Informatique. All rights reserved.

models.course = Backbone.Model.extend({
    initialize: function(params) {
    },
    
});

applications.course = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.slug = params.args[1];
        this.router = params.router;
        this.position = params.position;
        this.render();
    },

    events: {
        'click #document': function() {
            this.router.navigate('/document/course/' + this.slug, 
                                 {trigger: true});
            return false;
        },
        'click #infos': function() {
            this.router.navigate('/wiki/' + this.slug, 
                                 {trigger: true});
            return false;
        },
    },
    
    render: function() {
        $(this.el).html(templates['tpl-desk-course']({slug: this.slug}));
    },
});

models.Wiki = Backbone.Model.extend({
	initialize: function(id,view) {
		this.view = view;
    	this.id = 1;//Replace by "id" for the moment it's slug'
    	this.url = urls['wiki_bone_type_id'](this.id);
    	this.on("all", this.modelise);
    	this.fetch();
    },
    
	modelise: function(){
    	var courseJSON = this.toJSON()[0];
    	this.slug = courseJSON['course__slug'];
    	this.name = courseJSON['course__name'];
	    this.information = eval("("+courseJSON['infos']+")");
	    this.view.render();
    },
    
    get_form: function(key){
        for(i=0; (i<this.information.length)&&(this.information[i]['name']!=key); i++);
        this.currentEditing = i;
        return this.information[i]['values'];
    },
    
    form_push: function(fname,fvalue){
    	this.information[this.currentEditing]['values'].push({name: fname, values: fvalue});
    	this.view.update_after_add(this.information[this.currentEditing]['name']);
    },
    
    save: function(){
    	var dataPost = [];
    	dataPost.push({key:'info', value:JSON.stringify(this.information)});
    	dataPost.push({key:'id', value:this.id});
    	console.log(JSON.stringify(dataPost));
    	$.ajax({
                type: 'POST',
                url: urls['wiki_bone_save'],
                data: JSON.stringify(dataPost),
                success: function() {
                    this.initialize();
                },
                dataType: 'json',
        });
    	//this.initialize();
    },
    
    updateInfo: function(){
    	var current = this.information[this.currentEditing]['values'];
    	for(i=0; i<current.length; i++)
    		current[i]['values'] = $('#form_	'+current[i]['name']).val();
    	this.information[this.currentEditing]['values'] = current;
    	console.log(this.information);
    },
});

applications.wiki = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.type = params.type;
        this.context = params.context;
        this.infos = new Backbone.Model();
        this.infos.url = urls['wiki_bone_id'](this.context.get('infos'));
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
        	this.render();
        	var key = $(e.target).attr('data-target');
        	$("#"+key+"_container").html(templates['tpl-wiki-form']({form: this.wiki.get_form(key)}));
        },
        
        'click .signal': function(e) {
        	alert($(e.target).attr('data-target'));
        },
        
        'click #form_add_field': function() {
        	$("#current_edition").append('<li><input type="text" value="" name="add_key" id="wiki_form_add_key"><textarea value="" name="add_value" id="wiki_form_add_value"/><div id="wiki_form_add_submit">OK</div></li>');
        	$("#form_add_field").hide();
        },
        
        'click #wiki_form_add_submit': function() {
        	var name = $('#wiki_form_add_key').val();
        	var value = $('#wiki_form_add_value').val();
        	this.wiki.form_push(name,value);
        },
        
        'click #form_confirm': function() {
        	this.wiki.updateInfo();
        	this.wiki.save();
        },
    },
    
    render: function() {
        $(this.el).html(templates['tpl-course-wiki']({
            infos: this.infos.toJSON(),
            context: this.context.toJSON(),
        }));
        return this;
    },

    close: function() {},
});
