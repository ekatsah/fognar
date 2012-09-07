// Copyright 2012, Cercle Informatique. All rights reserved.

applications.preference = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'render');
        var self = this;
        $.getJSON('/preference/', function(data) {
            self.preference = data;
            self.render();
        })
    },

    render: function() {
        console.log("preference render");
        $(this.el).html(templates['tpl-preference'](this.preference));
        return this;
    },

    close: function() {},
});
