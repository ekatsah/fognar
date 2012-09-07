// Copyright 2012, Cercle Informatique. All rights reserved.

applications.desktop = Backbone.View.extend({
    events: {
        'click .dashboard-add': 'go_to_market',
        'click .dashboard-course': 'go_to_course',
    },

    initialize: function(params) {
        console.log('Initialize desktop');
        _.bindAll(this, 'render');
        this.router = params.router;
        this.popup = null;
        this.collection = new Backbone.Collection;
        this.collection.model = Backbone.Model;
        this.collection.url = "/desktop/";
        this.collection.fetch({
            success: this.render
        })
    },

    go_to_market: function() {
        this.router.navigate('/market', {trigger: true});
        return false;
    },

    go_to_course: function(e) {
        this.router.navigate('/course/' + $(e.target).attr('data-target'),
                             {trigger: true});
        return false;
    },

    render: function() {
        console.log(this.collection.toJSON());
        this.$el.html(templates['tpl-desktop']({
            shortcuts: this.collection.toJSON(),
        }));
    },

    close: function() {},
});
