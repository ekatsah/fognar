// Copyright 2012, Cercle Informatique. All rights reserved.

models.course = Backbone.Model.extend({
    initialize: function(params) {
        console.log('new course model');
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

applications.wiki = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.id = params.args[1];
        this.wiki = new Backbone.Model();
        this.wiki.url = urls['wiki_bone_type_id'](1);//replace by this.id
        this.wiki.on("all", this.render);
        this.wiki.fetch();
        this.render();
    },

    events: {

    },

    render: function() {
    	console.log(this.wiki.toJSON());
        $(this.el).html(templates['tpl-wiki']({wiki: this.wiki.toJSON()}));
        return this;
    },

});
