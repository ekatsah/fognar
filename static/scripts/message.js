// Copyright 2012, Cercle Informatique. All rights reserved.

applications.thread = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.type = params.type;
        this.context = params.context;
        this.render();
    },

    events: {},

    render: function() {
        console.log("thread render");
        $(this.el).html(templates['tpl-course-thread']({
            context: this.context.toJSON(),
        }));
        return this;
    },

    close: function() {},
});
