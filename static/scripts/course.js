// Copyright 2012, Cercle Informatique. All rights reserved.

models.course = Backbone.Model.extend({
    initialize: function(params) {
    },
    
};

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
    },
    
    render: function() {
        $(this.el).html(templates['tpl-desk-course']({slug: this.slug}));
    },
});
