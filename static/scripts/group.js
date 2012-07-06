// Copyright 2012, Cercle Informatique. All rights reserved.

applications.group = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'render');
        this.render();
    },

    events: {},

    render: function() {
        console.log("group render");
        $(this.el).html(templates['tpl-group']());
        return this;
    },
});
