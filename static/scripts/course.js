// Copyright 2012, RespLab. All rights reserved.

applications.course = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'render');
        this.render();
    },

    events: {},

    render: function() {
        console.log("course render");
        $(this.el).html(templates['tpl-course']());
        return this;
    },
});
