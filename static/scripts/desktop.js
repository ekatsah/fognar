// Copyright 2012, RespLab. All rights reserved.

applications.desktop = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.router = params.router;
        this.me = new Backbone.Model();
        this.me.url = urls.profile_me;
        this.me.on("change", this.render);
        this.me.fetch();
        this.config = params.config;
        this.render();
    },

    events: {
        'click #market': function() {
            this.router.navigate('/market', {trigger: true});
            return false;
        },
        'click .shortcut': function(e) {
            this.router.navigate('/' + e.target.getAttribute('data-type') + '/' + 
                e.target.getAttribute('data-target'), {trigger: true});
            return false;
        },
    },

    render: function() {
        console.log("desktop rendering");
        if (this.me.get('realname')) {
            $(this.el).html(templates['tpl-desktop']({profil: this.me.toJSON(), 
                shortcuts: this.config.shortcuts}));
            }
        else
            $(this.el).html(templates['tpl-loading']());
        return this;
    },
});
