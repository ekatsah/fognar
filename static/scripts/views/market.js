// Copyright 2012, Cercle Informatique. All rights reserved.

models.shortcut = Backbone.Model.extend({
    url: "/preference/shortcuts/add/",
});

applications.market_course = Backbone.View.extend({
    events: {
        "click .add-course": "add_course",
    },

    add_course: function(event) {
        event.preventDefault();
        console.log("Add course");
        var self = this;
        new_shortcut = new models.shortcut({
            app: "course",
            app_id: self.model.id,
        });
        new_shortcut.save();
        this.$el.remove();
    }
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

        this.collection.each(function(i) {
            new applications.market_course({
                el: $("#course_" + i.id),
                model: i,
            })
        })
    },

    close: function() {},
});
