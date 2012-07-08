 // Copyright 2012, Cercle Informatique. All rights reserved.

models.user = Backbone.Model.extend({
    initialize: function(params) {
        console.log('new user model');
    },
    
});

cache.users = new Backbone.Collection({
    model: models.user,
});
cache.users.url = '/profile';

applications.profile = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.router = params.router;
        this.render();
    },

    events: {
    },
    
    render: function() {
    },

    close: function() {},
});

