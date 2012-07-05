// Copyright 2012, RespLab. All rights reserved.

applications.market = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'render');
        this.render();
    },

    events: {},

    render: function() {
        console.log("market render");
        $(this.el).html(templates['tpl-market']());
        return this;
    },
});
