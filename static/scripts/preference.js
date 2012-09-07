// Copyright 2012, Cercle Informatique. All rights reserved.

applications.preference = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'render');
        this.render();
    },

    events: {},

    render: function() {
        console.log("preference render");
        $(this.el).html(templates['tpl-preference']());
        return this;
    },

    close: function() {},
});
