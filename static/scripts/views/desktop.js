// Copyright 2012, UrLab. All rights reserved.

applications.desktop = Backbone.View.extend({
    events: {
        'click .dashboard-preference': 'go_to_preference',
        'click .dashboard-market': 'go_to_market',
        'click .dashboard-course': 'go_to_course',
    },

    initialize: function(params) {
        _.bindAll(this, 'render', 'go_to_market', 'go_to_preference',
                  'go_to_course', 'close');

        cache.course.bind("change add", this.render);
        cache.group.bind("change add", this.render);

        this.router = params.router;
        this.shortcuts = new Backbone.Collection;
        this.shortcuts.url = "/rest/Shortcut/";
        this.shortcuts.fetch({
            success: this.render
        });
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
        this.$el.html(templates['desktop']({
            shortcuts: this.shortcuts.toJSON(),
        }));
    },

    close: function() {
        cache.course.unbind("change add", this.render);
        cache.group.unbind("change add", this.render);
    },
});
