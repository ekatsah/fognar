// Copyright 2012, Cercle Informatique. All rights reserved.

collections.shortcuts = Backbone.Collection.extend({
    url: "/preference/shortcuts/",
});

applications.shortcut = Backbone.View.extend({
    events: {
        "click a.remove": "remove_shortcut",
    },

    remove_shortcut: function(event) {
        event.preventDefault();
        var self = this;
        $.post('/preference/shortcuts/remove/' + this.model.id, {
            success: function() {
                self.collection.remove(this.model);
                self.$el.remove();
            }
        });
    }
});

applications.preference = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'render');
        var self = this;
        this.collection = new collections.shortcuts();
        this.collection.fetch({
            success: self.render,
        })
    },

    render: function() {
        $(this.el).html(templates['tpl-preference']({
            shortcuts: this.collection.toJSON()
        }));
        var self = this;
        this.collection.each(function(i) {
            new applications.shortcut({
                el: $("#shortcut_" + i.id),
                model: i,
                collection: self.collection,
            });
        })
    },

    close: function() {},
});
