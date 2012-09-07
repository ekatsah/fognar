// Copyright 2012, Cercle Informatique. All rights reserved.

models.shortcut = Backbone.Model.extend({
    url: "/preference/shortcuts/add/",
});

applications.market = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'render');
        this.collection = new collections.course();
        this.collection.url = "/course/market/";
        this.collection.fetch({
            success: this.render,
        })
    },

    events: {},

    render: function() {
        console.log("market render");
        console.log(this.collection.toJSON());
        $(this.el).html(templates['tpl-market']({
            course: this.collection.toJSON(),
        }));

    },

    close: function() {},
});
