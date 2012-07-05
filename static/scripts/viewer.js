// Copyright 2012, RespLab. All rights reserved.

applications.viewer = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'render');
        this.render();
    },

    events: {},

    render: function() {
        console.log("viewer render");
        $(this.el).html(templates['tpl-viewer']());
        return this;
    },
});
