 // Copyright 2012, Cercle Informatique. All rights reserved.

models.user = Backbone.Model.extend({
    initialize: function(params) {},
});

collections.users = Backbone.Collection.extend({
    model: models.user,

    url: '/profile',

    get_or_fetch: function(uid) {
        var ret = this.get(uid);
        if (ret == undefined) {
            this.add({id: uid});
            this.get(uid).fetch({success: function() {
                cache.users.trigger('fetched');
            }});
            return this.get(0);
        }
        return ret;
    }
});

cache.users = new collections.users({id: 0, name:'Chargement ...'});

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

