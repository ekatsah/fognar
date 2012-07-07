// Copyright 2012, Cercle Informatique. All rights reserved.



applications.desktop = Backbone.View.extend({
    initialize: function(params) {
        _.bindAll(this, 'render');
        this.router = params.router;
        this.me = new Backbone.Model();
        this.me.url = urls.profile_me;
        this.me.on("change", this.render);
        this.me.fetch();
        this.config = params.config;
        this.popup = null;
        this.render();
        console.log('Initialize desktop');
    },

    events: {
        'click .dashboard-add': function() {
            this.router.navigate('/market', {trigger: true});
            return false;
        },
        'click .dashboard-course': function(e) {
            this.router.navigate('/course/' + $(e.target).attr('data-target'),
                                 {trigger: true});
            return false;
        },
    },

    render: function() {
        if (this.me.get('realname')) {
            $(this.el).html(templates['tpl-desktop']({profil: this.me.toJSON(), 
                shortcuts: this.config.shortcuts}));
            $('#course_popup').css('display', 'none');
        } else
            $(this.el).html(templates['tpl-loading']());
        return this;
    },
});
