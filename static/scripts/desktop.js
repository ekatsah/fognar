// Copyright 2012, Cercle Informatique. All rights reserved.

applications.desktop = Backbone.View.extend({
    events: {
        'click .dashboard-add': 'go_to_market',
        'click .dashboard-course': 'go_to_course',
    },

    initialize: function(params) {
        _.bindAll(this, 'render');
        this.router = params.router;
        this.config = window.profile.get('desktop_config');
        this.popup = null;
        this.render();
        console.log('Initialize desktop');
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
        this.$el.html(templates['tpl-desktop']({shortcuts: this.config.shortcuts}));
        return this;
    },

    close: function() {},
});
