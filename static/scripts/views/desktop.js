// Copyright 2012, Cercle Informatique. All rights reserved.

applications.desktop = Backbone.View.extend({
    events: {
        'click .dashboard-preference': 'go_to_preference',
        'click .dashboard-market': 'go_to_market',
        'click .dashboard-course': 'go_to_course',
    },

    initialize: function(params) {
        console.log('Initialize desktop');
        _.bindAll(this, 'render');
        this.router = params.router;
        this.popup = null;
        this.collection = new Backbone.Collection;
        this.collection.model = Backbone.Model;
        this.collection.url = "/rest/Shortcut/";
        this.collection.fetch({
            success: this.render
        })
    },

    go_to_market: function() {
        this.router.navigate('/market', {trigger: true});
        return false;
    },

    go_to_preference: function() {
        this.router.navigate('/preference', {trigger: true});
        return false;
    },

    go_to_course: function(e) {
        this.router.navigate('/course/' + $(e.target).attr('data-target'),
                             {trigger: true});
        return false;
    },

    render: function() {
        this.$el.html(templates['tpl-desktop']({
            shortcuts: this.collection.toJSON(),
        }));
    },

    close: function() {},
});
