// Copyright 2012, Cercle Informatique. All rights reserved.

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
