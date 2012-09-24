// Copyright 2012, UrLab. All rights reserved.

applications.navbar = Backbone.View.extend({
    initialize: function(params) {
        console.log("initialize navbar view");
        $(this.el).prepend(templates['navbar']({
            name: window.profile.get('name')
        }));
        this.router = params.router;
        this.el = $('#navbar');
    },

    events: {
        'click #logo': function() {
            this.router.navigate('/desktop', {trigger: true});
        },
    },
    close: function() {},
});
